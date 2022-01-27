import { Connection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { UserWalletTransactionRepository } from '$/db/repositories/aggregate/user-wallet-transaction.repository';
import { UserWalletRepository } from '$/db/repositories/aggregate/user-wallet.repository';
import { UserEntityRepository } from '$/db/repositories/core/user-entity.repository';

@Injectable()
export class UserRepository implements Api.Repositories.User {
  // Aggregate
  private readonly userWalletTransactionRepository: UserWalletTransactionRepository;
  private readonly userWalletRepository: UserWalletRepository;
  // Core
  private readonly userEntityRepository: UserEntityRepository;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    this.userWalletTransactionRepository = new UserWalletTransactionRepository(this.connection);
    this.userWalletRepository = new UserWalletRepository(this.connection);
    this.userEntityRepository = new UserEntityRepository(this.connection.manager);
  }

  create(data: {
    email: Email;
    password: string;
    wallet: { balance: number; name: string };
  }): Promise<Api.Entities.User> {
    return this.userWalletRepository.create(data);
  }

  delete(data: { userUuid: Uuid }): Promise<Api.Repositories.Responses.DeleteResult> {
    return this.userEntityRepository.delete(data);
  }

  findByUserUuid(data: { userUuid: Uuid }): Promise<Api.Entities.User | undefined> {
    return this.userWalletTransactionRepository.findByUserUuid(data);
  }

  findByValidCredentials(data: {
    email: Email;
    password: string;
  }): Promise<Api.Entities.User | undefined> {
    return this.userEntityRepository.findByValidCredentials(data);
  }
}
