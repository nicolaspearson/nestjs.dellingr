import { Connection, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import User from '$/db/entities/user.entity';

@Injectable()
export class UserWalletTransactionRepository {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  private query(): SelectQueryBuilder<User> {
    return this.connection.manager
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.wallets', 'wallets')
      .leftJoinAndSelect('wallets.transactions', 'transactions');
  }

  findByUserUuid(userUuid: Uuid): Promise<User | undefined> {
    return this.query().where({ uuid: userUuid }).getOne();
  }
}
