import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import Wallet from '$/db/entities/wallet.entity';
import { userFixtures } from '$/db/fixtures/user.fixture';

export const walletFixtures: QueryDeepPartialEntity<Wallet>[] = [
  {
    uuid: '2103b97d-2204-440c-aced-e9b3cb38a8c6' as Uuid,
    balance: 875,
    name: 'Main',
    user: { uuid: userFixtures[0].uuid },
  },
];
