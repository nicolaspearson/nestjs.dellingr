import { Connection, SelectQueryBuilder } from 'typeorm';

import { InjectConnection } from '@nestjs/typeorm';

import Wallet from '$/db/entities/wallet.entity';

export class WalletTransactionRepository {
  constructor(
    @InjectConnection()
    protected readonly connection: Connection,
  ) {}

  private query(): SelectQueryBuilder<Wallet> {
    return this.connection.manager
      .createQueryBuilder(Wallet, 'wallet')
      .leftJoinAndSelect('wallet.transactions', 'transactions');
  }

  findByWalletUuid(data: { userUuid: Uuid; walletUuid: Uuid }): Promise<Wallet | undefined> {
    return this.query()
      .where({
        uuid: data.walletUuid,
        user: {
          uuid: data.userUuid,
        },
      })
      .getOne();
  }
}
