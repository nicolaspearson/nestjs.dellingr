import { Connection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { NotFoundError } from '$/common/error';
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

  create(data: { name: string; userUuid: Uuid }): Promise<Api.Entities.Wallet> {
    return this.walletEntityRepository.create(data);
  }

  findByUuid(data: { userUuid: Uuid; walletUuid: Uuid }): Promise<Api.Entities.Wallet | undefined> {
    return this.walletTransactionRepository.findByWalletUuid(data);
  }

  async findByUuidOrFail(data: { userUuid: Uuid; walletUuid: Uuid }): Promise<Api.Entities.Wallet> {
    const wallet = await this.findByUuid(data);
    if (!wallet) {
      throw new NotFoundError(`Wallet with uuid: ${data.userUuid} does not exist.`);
    }
    return wallet;
  }
}
