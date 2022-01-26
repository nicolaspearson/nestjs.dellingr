import { Connection, DeleteResult } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import User from '$/db/entities/user.entity';
import { UserWalletTransactionRepository } from '$/db/repositories/aggregate/user-wallet-transaction.repository';
import { UserWalletRepository } from '$/db/repositories/aggregate/user-wallet.repository';
import { UserEntityRepository } from '$/db/repositories/core/user-entity.repository';

@Injectable()
export class UserRepository {
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
  }): Promise<User> {
    return this.userWalletRepository.create(data);
  }

  delete(uuid: Uuid): Promise<DeleteResult> {
    return this.userEntityRepository.delete(uuid);
  }

  findByUserUuid(userUuid: Uuid): Promise<User | undefined> {
    return this.userWalletTransactionRepository.findByUserUuid(userUuid);
  }

  findByValidCredentials(email: Email, password: string): Promise<User | undefined> {
    return this.userEntityRepository.findByValidCredentials(email, password);
  }
}
