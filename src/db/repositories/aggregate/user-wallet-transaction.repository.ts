import { Connection, SelectQueryBuilder } from 'typeorm';

import User from '$/db/entities/user.entity';

export class UserWalletTransactionRepository {
  constructor(private readonly connection: Connection) {}

  private query(): SelectQueryBuilder<User> {
    return this.connection.manager
      .createQueryBuilder(User, 'user')
      .leftJoinAndSelect('user.wallets', 'wallets')
      .leftJoinAndSelect('wallets.transactions', 'transactions');
  }

  findByUserUuid(data: { userUuid: Uuid }): Promise<User | undefined> {
    return this.query().where({ uuid: data.userUuid }).getOne();
  }
}
