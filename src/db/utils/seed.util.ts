import { oneLine } from 'common-tags';
import { Connection, ObjectType } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import Transaction from '$/db/entities/transaction.entity';
import User from '$/db/entities/user.entity';
import Wallet from '$/db/entities/wallet.entity';
import { transactionFixtures } from '$/db/fixtures/transaction.fixture';
import { userFixtures } from '$/db/fixtures/user.fixture';
import { walletFixtures } from '$/db/fixtures/wallet.fixture';

type Entity = ObjectType<Record<string, unknown>>;

interface Fixture {
  entity: Entity;
  values: QueryDeepPartialEntity<Entity>[];
}

const fixtures: Fixture[] = [
  { entity: User, values: userFixtures },
  { entity: Wallet, values: walletFixtures },
  { entity: Transaction, values: transactionFixtures },
];

export async function seedDatabase(connection: Connection): Promise<void> {
  // Avoid seeding multiple times when webpack HMR is used
  const user = await connection.manager
    .createQueryBuilder(User, 'user')
    .where({ uuid: userFixtures[0].uuid })
    .getOne();
  // If the user already exists we skip the seeding process
  if (!user) {
    await connection.query(oneLine`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    for (const fixture of fixtures) {
      await connection
        .createQueryBuilder()
        .insert()
        .into(fixture.entity)
        .values(fixture.values)
        .execute();
    }
  }
}
