import { Connection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { WalletTransactionRepository } from '$/db/repositories/aggregate/wallet-transaction.repository';
import { WalletEntityRepository } from '$/db/repositories/core/wallet-entity.repository';

@Injectable()
export class WalletRepository implements Api.Repositories.Wallet {
  // Aggregate
  private readonly walletTransactionRepository: WalletTransactionRepository;
  // Core
  private readonly walletEntityRepository: WalletEntityRepository;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    this.walletTransactionRepository = new WalletTransactionRepository(this.connection);
    this.walletEntityRepository = new WalletEntityRepository(this.connection.manager);
  }

  create(data: { userUuid: Uuid; name: string }): Promise<Api.Entities.Wallet> {
    return this.walletEntityRepository.create(data);
  }

  findByWalletUuid(data: {
    userUuid: Uuid;
    walletUuid: Uuid;
  }): Promise<Api.Entities.Wallet | undefined> {
    return this.walletTransactionRepository.findByWalletUuid(data);
  }
}
