import { AbstractRepository, EntityManager, EntityRepository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable } from '@nestjs/common';

import Wallet from '$/db/entities/wallet.entity';

@Injectable()
@EntityRepository(Wallet)
export class WalletRepository extends AbstractRepository<Wallet> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  create(data: { userUuid: Uuid; name: string }): Promise<Wallet> {
    const partialWallet: QueryDeepPartialEntity<Wallet> = {
      balance: 0,
      name: data.name,
      transactions: [],
      user: {
        uuid: data.userUuid,
      },
    };
    return this.manager.save(Wallet, partialWallet as Wallet);
  }
}
