import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from '$/common/error';
import Transaction from '$/db/entities/transaction.entity';
import { DatabaseTransactionService } from '$/db/services/database-transaction.service';

type QueryOptions = {
  withWallet: boolean;
  withWalletUser: boolean;
};

@Injectable()
export class TransactionRepository implements Api.Repositories.Transaction {
  private readonly logger: Logger = new Logger(TransactionRepository.name);

  constructor(private readonly databaseTransactionService: DatabaseTransactionService) {
    this.logger.debug('Transaction repository created!');
  }

  private getManager(): EntityManager {
    return this.databaseTransactionService.getManager();
  }

  private query(options?: QueryOptions): SelectQueryBuilder<Transaction> {
    const query = this.getManager().createQueryBuilder(Transaction, 'transaction');
    if (options?.withWallet) {
      query.leftJoinAndSelect('transaction.wallet', 'wallet');
      if (options?.withWalletUser) {
        query.leftJoinAndSelect('wallet.user', 'user');
      }
    }
    return query;
  }

  create(data: Api.Repositories.Requests.CreateTransaction): Promise<Api.Entities.Transaction> {
    const partialTransaction: QueryDeepPartialEntity<Api.Entities.Transaction> = {
      amount: data.amount,
      reference: data.reference,
      state: data.state,
      type: data.type,
      wallet: {
        uuid: data.walletUuid,
      },
    };
    return this.getManager().save(Transaction, partialTransaction as Transaction);
  }

  findByTransactionAndUserUuid(
    data: Api.Repositories.Requests.FindByTransactionAndUserUuid,
  ): Promise<Api.Entities.Transaction | undefined> {
    return this.query({
      withWallet: true,
      withWalletUser: true,
    })
      .where({
        uuid: data.transactionUuid,
        wallet: {
          user: {
            uuid: data.userUuid,
          },
        },
      })
      .getOne();
  }

  async findByTransactionAndUserUuidOrFail(
    data: Api.Repositories.Requests.FindByTransactionAndUserUuid,
  ): Promise<Api.Entities.Transaction> {
    const transaction = await this.findByTransactionAndUserUuid(data);
    if (!transaction) {
      throw new NotFoundError(`Transaction with uuid: ${data.transactionUuid} does not exist.`);
    }
    return transaction;
  }
}
