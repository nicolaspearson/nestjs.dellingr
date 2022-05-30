import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

import { DatabaseConfigService } from '$/common/config/database/database.config.service';
import { configService } from '$/common/config/typed-config.module';

const databaseConfigService = new DatabaseConfigService(configService);

export const dataSource = new DataSource(
  databaseConfigService.createTypeOrmOptions() as DataSourceOptions,
);

export async function initializeDataSource(): Promise<DataSourceOptions> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
  return dataSource.options;
}
