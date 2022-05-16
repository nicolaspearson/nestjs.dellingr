import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { selectConfig } from 'nest-typed-config-extended';

import { DatabaseConfig } from '$/common/config/database/database.config';
import { createTypedConfigModule } from '$/common/config/typed-config.module';

const databaseConfig = selectConfig(createTypedConfigModule(), DatabaseConfig);

export const dataSource = new DataSource({
  type: databaseConfig.type,
  database: databaseConfig.credentials.database,
  schema: databaseConfig.credentials.schema,
  host: databaseConfig.credentials.host,
  port: databaseConfig.credentials.port,
  password: databaseConfig.credentials.password,
  username: databaseConfig.credentials.username,
  logging: databaseConfig.logging,
  entities: databaseConfig.entities,
  migrationsRun: databaseConfig.migrationsRun,
  migrations: databaseConfig.migrations,
  dropSchema: databaseConfig.dropSchema,
  synchronize: databaseConfig.synchronize,
});

export async function initializeDataSource(): Promise<DataSourceOptions> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource.options;
}
