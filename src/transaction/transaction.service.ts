import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { TransactionResponse } from '$/common/dto';
import { NotFoundError } from '$/common/error';
import Transaction from '$/db/entities/transaction.entity';
import { TransactionRepository } from '$/db/repositories/transaction.repository';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);

  constructor(
    @InjectRepository(TransactionRepository)
    private readonly transactionRepository: TransactionRepository,
  ) {}

  /**
   * Retrieves the specified user transaction from the database.
   *
   * @param transactionUuid The uuid of the transaction.
   * @returns The {@link TransactionResponse} object.
   *
   * @throws {@link NotFoundError} If the transaction does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async getById(transactionUuid: Uuid): Promise<TransactionResponse> {
    this.logger.log(`Retrieving user transaction with uuid: ${transactionUuid}`);
    const transaction = await this.findTransactionOrFail(transactionUuid);
    return new TransactionResponse(transaction);
  }

  private async findTransactionOrFail(transactionUuid: Uuid): Promise<Transaction> {
    const transaction = await this.transactionRepository.findByUuid(transactionUuid);
    if (!transaction) {
      throw new NotFoundError('Transaction does not exist.');
    }
    return transaction;
  }
}
