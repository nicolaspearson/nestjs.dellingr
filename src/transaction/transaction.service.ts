import { Injectable, Logger } from '@nestjs/common';

import { CreateTransactionRequest } from '$/common/dto';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import { BadRequestError, NotFoundError } from '$/common/error';
import { TransactionRepository, WalletRepository } from '$/db/repositories';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  /**
   * Creates a new transaction using the specified wallet.
   *
   * @param userUuid The uuid of the user.
   * @param dto The {@link CreateTransactionRequest} object.
   * @returns The {@link Api.Entities.Transaction} object.
   *
   * @throws {@link BadRequestError} If the wallet has insufficient funds.
   * @throws {@link NotFoundError} If the wallet does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async create(userUuid: Uuid, dto: CreateTransactionRequest): Promise<Api.Entities.Transaction> {
    const wallet = await this.walletRepository.findByUuid({ userUuid, walletUuid: dto.walletId });
    if (!wallet) {
      throw new NotFoundError('Wallet does not exist.');
    }
    this.logger.log(`Creating new transaction for user with uuid: ${userUuid}`);
    // Creating the transaction in a pending state
    const transaction = await this.transactionRepository.create({
      ...dto,
      state: TransactionState.Pending,
      walletUuid: dto.walletId,
    });
    let balance;
    switch (dto.type) {
      case TransactionType.Credit:
        // Credit the wallet balance
        balance = wallet.balance + dto.amount;
        break;

      case TransactionType.Debit:
        // Ensure there is enough credit in the wallet to process the transaction
        if (wallet.balance - dto.amount >= 0) {
          // Debit the wallet balance
          balance = wallet.balance - dto.amount;
        } else {
          // Reject the transaction
          await this.transactionRepository.updateState({
            state: TransactionState.Rejected,
            transactionUuid: transaction.uuid,
          });
          throw new BadRequestError('Insufficient funds');
        }
        break;
    }
    await this.transactionRepository.process({
      balance,
      transactionUuid: transaction.uuid,
      walletUuid: wallet.uuid,
    });
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
    // TODO: Ensure the transaction belongs to the user
    this.logger.log(`Retrieving user transaction with uuid: ${transactionUuid}`);
    return this.findTransactionOrFail(userUuid, transactionUuid);
  }

  private async findTransactionOrFail(
    userUuid: Uuid,
    transactionUuid: Uuid,
  ): Promise<Api.Entities.Transaction> {
    const transaction = await this.transactionRepository.findByUuid({ transactionUuid, userUuid });
    if (!transaction) {
      throw new NotFoundError('Transaction does not exist.');
    }
    return transaction;
  }
}
