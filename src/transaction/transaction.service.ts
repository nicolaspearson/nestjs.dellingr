import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from '$/common/error';
import { TransactionRepository } from '$/db/repositories/transaction.repository';

@Injectable()
export class TransactionService {
  private readonly logger: Logger = new Logger(TransactionService.name);

  constructor(private readonly transactionRepository: TransactionRepository) {}

  /**
   * Retrieves the specified user transaction from the database.
   *
   * @param transactionUuid The uuid of the transaction.
   * @returns The {@link Api.Entities.Transaction} object.
   *
   * @throws {@link NotFoundError} If the transaction does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  getById(transactionUuid: Uuid): Promise<Api.Entities.Transaction> {
    this.logger.log(`Retrieving user transaction with uuid: ${transactionUuid}`);
    return this.findTransactionOrFail(transactionUuid);
  }

  private async findTransactionOrFail(transactionUuid: Uuid): Promise<Api.Entities.Transaction> {
    const transaction = await this.transactionRepository.findByUuid({ transactionUuid });
    if (!transaction) {
      throw new NotFoundError('Transaction does not exist.');
    }
    return transaction;
  }
}
