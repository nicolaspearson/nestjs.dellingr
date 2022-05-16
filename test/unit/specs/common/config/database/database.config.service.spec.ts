import { DatabaseConfigService } from '$/common/config/database/database.config.service';
import { PostgresCredentialsConfig } from '$/common/config/database/postgres-credentials.config';
import { Environment } from '$/common/enum/environment.enum';

import { configService, databaseConfig } from '#/utils/config';

describe('Database Config Service', () => {
  describe('postgres', () => {
    const credentials: PostgresCredentialsConfig = {
      database: databaseConfig.credentials.database,
      schema: databaseConfig.credentials.schema,
      host: databaseConfig.credentials.host,
      port: databaseConfig.credentials.port,
      password: databaseConfig.credentials.password,
      username: databaseConfig.credentials.username,
    };

    test('should create the database config correctly', () => {
      const databaseConfigService = new DatabaseConfigService({
        ...configService,
        database: {
          ...configService.database,
          logging: ['error', 'schema', 'warn'],
        },
      });
      expect(databaseConfigService.createTypeOrmOptions()).toMatchObject({
        ...credentials,
        entities: [expect.stringContaining(databaseConfig.entities[0])],
        logging: ['error', 'schema', 'warn'],
        migrations: [expect.stringContaining(databaseConfig.migrations[0])],
        type: 'postgres',
      });
    });

    test('should create the database config correctly for production environments', () => {
      const databaseConfigService = new DatabaseConfigService({
        ...configService,
        nodeEnv: Environment.Production,
      });
      expect(databaseConfigService.createTypeOrmOptions()).toMatchObject({
        ...credentials,
        entities: [expect.stringContaining(databaseConfig.entities[0])],
        logging: ['error', 'schema', 'warn'],
        migrations: [expect.stringContaining(databaseConfig.migrations[0])],
        type: 'postgres',
      });
    });
  });
});
