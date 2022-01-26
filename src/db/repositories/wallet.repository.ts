import { AbstractRepository, EntityManager, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';

import Wallet from '$/db/entities/wallet.entity';

@Injectable()
@EntityRepository(Wallet)
export class WalletRepository extends AbstractRepository<Wallet> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  private walletQuery(): SelectQueryBuilder<Wallet> {
    return this.manager.createQueryBuilder(Wallet, 'wallet');
  }

  findByUuid(uuid: Uuid): Promise<Wallet | undefined> {
    return this.walletQuery().where({ uuid }).getOne();
  }
}
