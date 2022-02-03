import { oneLine } from 'common-tags';
import helmet from 'helmet';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '$/app/app.module';
import { AppService } from '$/app/app.service';
import { getValidationSchema } from '$/common/config/environment.config';
import { TypeOrmConfigService } from '$/common/config/typeorm.config';
import { API_GLOBAL_PREFIX } from '$/common/constants';
import { ErrorFilter } from '$/common/filters/error.filter';
import { DtoValidationPipe } from '$/common/pipes/dto-validation.pipe';

import { NoOutputLogger } from '#/utils/integration/no-output.logger';

export interface TestRunner {
  application: INestApplication;
  close: () => Promise<void>;
  connection: Connection;
}

export async function createTestRunner(options: { schema: string }): Promise<TestRunner> {
  // Configure the database and create a connection
  const connection = await createDatabaseConnection(options.schema);

  // Create the testing module
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      ConfigModule.forRoot({
        isGlobal: true,
        ignoreEnvFile: true,
        ignoreEnvVars: false,
        validationSchema: getValidationSchema(),
      }),
      TypeOrmModule.forRoot(connection.options),
    ],
  })
    .setLogger(new NoOutputLogger())
    .compile();

  // Create and configure the application
  const application = module.createNestApplication();
  application.setGlobalPrefix(API_GLOBAL_PREFIX);
  application.enableCors({
    credentials: true,
    methods: 'DELETE,HEAD,GET,OPTIONS,PATCH,POST,PUT',
    origin: [/localhost$/],
  });
  application.use(helmet());
  application.useGlobalFilters(new ErrorFilter());
  application.useGlobalPipes(new DtoValidationPipe());

  // Seed and initialize the application
  await application.get<AppService>(AppService).seed(connection);
  await application.init();

  return {
    application,
    connection,
    close: async (): Promise<void> => {
      await connection.close();
      await application.close();
    },
  };
}

async function createDatabaseConnection(schema: string): Promise<Connection> {
  // Create the default connection options
  const connectionOptions = TypeOrmConfigService.creatConnectionOptions();

  // Connect to the database using the public schema and configure it
  const connection = await createConnection({
    ...connectionOptions,
    logging: false,
    schema: 'public',
  } as ConnectionOptions);
  await connection.query(oneLine`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP SCHEMA IF EXISTS ${schema} CASCADE;
    CREATE SCHEMA IF NOT EXISTS ${schema};
  `);
  await connection.close();

  // Create a new connection using the specified schema
  return createConnection({ ...connectionOptions, logging: false, schema } as ConnectionOptions);
}
