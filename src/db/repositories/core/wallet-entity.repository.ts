import { AbstractRepository, EntityManager, EntityRepository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import Wallet from '$/db/entities/wallet.entity';

@EntityRepository(Wallet)
export class WalletEntityRepository extends AbstractRepository<Wallet> {
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
