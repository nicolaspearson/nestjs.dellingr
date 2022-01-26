import { Connection, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import Wallet from '$/db/entities/wallet.entity';

@Injectable()
export class WalletTransactionRepository {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  private query(): SelectQueryBuilder<Wallet> {
    return this.connection.manager
      .createQueryBuilder(Wallet, 'wallet')
      .leftJoinAndSelect('wallet.transactions', 'transactions');
  }

  findByWalletUuid(userUuid: Uuid, walletUuid: Uuid): Promise<Wallet | undefined> {
    return this.query()
      .where({
        uuid: walletUuid,
        user: {
          uuid: userUuid,
        },
      })
      .getOne();
  }
}
