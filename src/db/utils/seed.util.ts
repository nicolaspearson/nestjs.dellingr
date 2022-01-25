import { oneLine } from 'common-tags';
import { Connection, ObjectType } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import User from '$/db/entities/user.entity';
import { userFixtures } from '$/db/fixtures/user.fixture';

type Entity = ObjectType<Record<string, unknown>>;

interface Fixture {
  entity: Entity;
  values: QueryDeepPartialEntity<Entity>[];
}

const fixtures: Fixture[] = [{ entity: User, values: userFixtures }];

export async function seed(connection: Connection): Promise<void> {
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
