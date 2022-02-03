import { oneLine } from 'common-tags';
import helmet from 'helmet';
import { Client } from 'pg';
import { Connection, createConnection } from 'typeorm';

import { ExceptionFilter, INestApplication, ValidationPipe } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppModule } from '$/app/app.module';
import { AppService } from '$/app/app.service';
import { getValidationSchema } from '$/common/config/environment.config';
import { TypeOrmConfigService } from '$/common/config/typeorm.config';
import { API_GLOBAL_PREFIX } from '$/common/constants';
import { ErrorFilter } from '$/common/filters/error.filter';
import { DtoValidationPipe } from '$/common/pipes/dto-validation.pipe';

import { NoOutputLogger } from '#/utils/integration/no-output.logger';

export interface IntegrationTestApplication {
  application: INestApplication;
  connection: Connection;
  module: TestingModule;
}

export interface Options {
  dbSchema: string;
  enableCors?: boolean;
  enableHelmet?: boolean;
  enableLogging?: boolean;
  globalFilters?: ExceptionFilter[];
  globalPipes?: ValidationPipe[];
  globalPrefix?: string;
  metadata?: ModuleMetadata;
  overrides?: { token: string | symbol | Type<unknown>; value: unknown }[];
  seedS3?: boolean;
}

export async function setupApplication(options: Options): Promise<IntegrationTestApplication> {
  const instance = await createApplication({
    ...options,
    enableCors: true,
    enableHelmet: true,
    globalPrefix: API_GLOBAL_PREFIX,
    globalFilters: [new ErrorFilter()],
    globalPipes: [new DtoValidationPipe()],
  });

  // Seed the application and close the default database connection
  await instance.application.get<AppService>(AppService).seed(instance.connection);
  await instance.connection.close();

  await instance.application.init();
  return instance;
}

async function createApplication(options: Options): Promise<IntegrationTestApplication> {
  const imports = [...(options.metadata?.imports ?? []), AppModule];

  imports.push(
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      ignoreEnvVars: false,
      validationSchema: getValidationSchema(),
    }),
  );

  const connection = await createDatabase(options.dbSchema);

  imports.push(TypeOrmModule.forRoot(connection.options));

  const builder: TestingModuleBuilder = Test.createTestingModule({
    controllers: options.metadata?.controllers,
    exports: options.metadata?.exports,
    imports,
    providers: options.metadata?.providers,
  });

  if (options.overrides) {
    for (const override of options.overrides) {
      builder.overrideProvider(override.token).useValue(override.value);
    }
  }

  if (options.enableLogging) {
    builder.setLogger(console);
  } else {
    builder.setLogger(new NoOutputLogger());
  }

  const module: TestingModule = await builder.compile();
  const application = module.createNestApplication();

  if (options.enableCors) {
    application.enableCors({
      credentials: true,
      methods: 'DELETE,HEAD,GET,OPTIONS,PATCH,POST,PUT',
      origin: [/localhost$/],
    });
  }
  if (options.enableHelmet) {
    application.use(helmet());
  }

  if (options.globalPrefix) {
    application.setGlobalPrefix(options.globalPrefix);
  }
  if (options.globalFilters && options.globalFilters.length > 0) {
    application.useGlobalFilters(...options.globalFilters);
  }
  if (options.globalPipes) {
    application.useGlobalPipes(...options.globalPipes);
  }

  return { application, connection, module };
}

async function createDatabase(schema: string): Promise<Connection> {
  const client = new Client({
    user: process.env.TYPEORM_USERNAME,
    host: process.env.TYPEORM_HOST,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    port: Number(process.env.TYPEORM_PORT),
  });
  await client.connect();

  try {
    // Create database extensions and schema
    await client.query(oneLine`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      DROP SCHEMA IF EXISTS ${schema} CASCADE;
      CREATE SCHEMA IF NOT EXISTS ${schema};
    `);
  } catch (error) {
    console.error(error);
  }

  await client.end();

  // Initialize TypeORM with the newly created database
  const connectionOptions = TypeOrmConfigService.creatConnectionOptions();
  Object.assign(connectionOptions, {
    schema,
    synchronize: true,
    dropSchema: false,
    logging: false,
  });

  return createConnection(connectionOptions);
}
