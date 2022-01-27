import { Connection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { WalletTransactionRepository } from '$/db/repositories/aggregate/wallet-transaction.repository';
import { WalletEntityRepository } from '$/db/repositories/entity/wallet-entity.repository';

@Injectable()
export class WalletRepository implements Api.Repositories.Wallet {
  constructor(
    @InjectConnection()
    protected readonly connection: Connection,
    // Aggregate Repositories
    private readonly walletTransactionRepository: WalletTransactionRepository,
    // Entity Repositories
    private readonly walletEntityRepository: WalletEntityRepository,
  ) {}

  create(data: { userUuid: Uuid; name: string }): Promise<Api.Entities.Wallet> {
    return this.walletEntityRepository.create(data);
  }

  findByUuid(data: { userUuid: Uuid; walletUuid: Uuid }): Promise<Api.Entities.Wallet | undefined> {
    return this.walletTransactionRepository.findByWalletUuid(data);
  }
}
