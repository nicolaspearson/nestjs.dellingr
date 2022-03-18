import { DataSource, ObjectType } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable, Logger } from '@nestjs/common';

import { Transaction } from '$/db/entities/transaction.entity';
import { User } from '$/db/entities/user.entity';
import { Wallet } from '$/db/entities/wallet.entity';
import { transactionFixtures } from '$/db/fixtures/transaction.fixture';
import { userFixtures } from '$/db/fixtures/user.fixture';
import { walletFixtures } from '$/db/fixtures/wallet.fixture';

type Entity = ObjectType<Record<string, unknown>>;

interface Fixture {
  entity: Entity;
  values: QueryDeepPartialEntity<Entity>[];
}

@Injectable()
export class DatabaseSeederService {
  private readonly logger: Logger = new Logger(DatabaseSeederService.name);

  constructor() {
    this.logger.debug('Database seeder service created!');
  }

  async seed(dataSource: DataSource): Promise<void> {
    this.logger.debug('Seeding database');
    try {
      // Avoid seeding multiple times when webpack HMR is used
      const user = await dataSource.manager
        .createQueryBuilder(User, 'user')
        .where({ uuid: userFixtures[0].uuid })
        .getOne();

      // If the user already exists we skip the seeding process
      if (!user) {
        const fixtures: Fixture[] = [
          { entity: User, values: userFixtures },
          { entity: Wallet, values: walletFixtures },
          { entity: Transaction, values: transactionFixtures },
        ];
        for (const fixture of fixtures) {
          this.logger.debug(`Seeding "${fixture.entity.name}" entity fixures`);
          await dataSource
            .createQueryBuilder()
            .insert()
            .into(fixture.entity)
            .values(fixture.values)
            .execute();
        }
      } else {
        this.logger.debug('Database already seeded, skipped.');
      }
    } catch (error) {
      console.log(error);
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(1);
    }
  }
}
