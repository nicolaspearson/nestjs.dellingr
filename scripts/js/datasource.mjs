import 'dotenv/config';
import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  database: process.env.TYPEORM_DATABASE,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  host: process.env.TYPEORM_HOST,
  schema: process.env.TYPEORM_SCHEMA,
  synchronize: process.env.TYPEORM_SYNCHRONIZE,
  dropSchema: process.env.TYPEORM_DROP_SCHEMA,
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [process.env.TYPEORM_MIGRATIONS],
  migrationsRun: process.env.TYPEORM_MIGRATIONS_RUN,
});

dataSource.initialize();
