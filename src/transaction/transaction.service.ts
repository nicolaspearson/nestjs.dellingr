import { Injectable, Logger } from '@nestjs/common';

import { CreateTransactionRequest } from '$/common/dto';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import { TransactionRepository, WalletRepository } from '$/db/repositories';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {
    this.logger.debug('Transaction service created!');
  }

  private async processTransaction(
    data: {
      balance: number;
    } & CreateTransactionRequest,
  ): Promise<Api.Entities.Transaction> {
    const transaction = await this.transactionRepository.create({
      amount: data.amount,
      reference: data.reference,
      state: TransactionState.Processed,
      type: data.type,
      walletUuid: data.walletId,
    });
    // Update the wallet balance
    await this.walletRepository.updateBalance({
      balance: data.balance,
      walletUuid: data.walletId,
    });
    return transaction;
  }

  private async rejectTransaction(
    data: CreateTransactionRequest,
  ): Promise<Api.Entities.Transaction> {
    return this.transactionRepository.create({
      amount: data.amount,
      reference: data.reference,
      state: TransactionState.Rejected,
      type: data.type,
      walletUuid: data.walletId,
    });
  }

  /**
   * Creates a new transaction using the specified wallet.
   *
   * @param userUuid The uuid of the user.
   * @param dto The {@link CreateTransactionRequest} object.
   * @returns The {@link Api.Entities.Transaction} object.
   *
   * @throws {@link NotFoundError} If the wallet does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async create(userUuid: Uuid, dto: CreateTransactionRequest): Promise<Api.Entities.Transaction> {
    const wallet = await this.walletRepository.findByWalletAndUserUuidOrFail({
      userUuid,
      walletUuid: dto.walletId,
    });
    this.logger.log(`Creating new transaction for user with uuid: ${userUuid}`);
    const balance: number =
      dto.type === TransactionType.Credit
        ? wallet.balance + dto.amount
        : wallet.balance - dto.amount;
    const transaction = await (balance < 0
      ? this.rejectTransaction(dto)
      : this.processTransaction({
          ...dto,
          balance,
        }));
    return transaction;
  }

  /**
   * Retrieves the specified user transaction from the database.
   *
   * @param transactionUuid The uuid of the transaction.
   * @returns The {@link Api.Entities.Transaction} object.
   *
   * @throws {@link NotFoundError} If the transaction does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  getById(userUuid: Uuid, transactionUuid: Uuid): Promise<Api.Entities.Transaction> {
    this.logger.log(`Retrieving user transaction with uuid: ${transactionUuid}`);
    return this.transactionRepository.findByTransactionAndUserUuidOrFail({
      transactionUuid,
      userUuid,
    });
  }
}
