import { Connection, SelectQueryBuilder } from 'typeorm';

import { InjectConnection } from '@nestjs/typeorm';

import Transaction from '$/db/entities/transaction.entity';

export class TransactionWalletUserRepository {
  constructor(
    @InjectConnection()
    protected readonly connection: Connection,
  ) {}

  private query(): SelectQueryBuilder<Transaction> {
    return this.connection.manager
      .createQueryBuilder(Transaction, 'transaction')
      .leftJoinAndSelect('transaction.wallet', 'wallet')
      .leftJoinAndSelect('wallet.user', 'user');
  }

  findByTransactionUuid(data: {
    transactionUuid: Uuid;
    userUuid: Uuid;
  }): Promise<Transaction | undefined> {
    return this.query()
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
}
