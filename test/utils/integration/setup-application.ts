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
import { TypeOrmConfigService } from '$/common/config/typeorm.config';
import { seed } from '$/db/utils/seed.util';

import { NoOutputLogger } from '#/utils/integration/no-output.logger';

export interface Options {
  dbSchema?: string;
  disableLogging?: boolean;
  enableCors?: boolean;
  enableHelmet?: boolean;
  globalFilters?: ExceptionFilter[];
  globalPipes?: ValidationPipe[];
  globalPrefix?: string;
  metadata?: ModuleMetadata;
  overrides?: { token: string | symbol | Type<unknown>; value: unknown }[];
}

export async function setupApplication(options?: Options): Promise<{
  application: INestApplication;
  module: TestingModule;
}> {
  const instance = await create({
    ...options,
    disableLogging: true,
    enableCors: true,
    enableHelmet: true,
    globalPrefix: '/api/v1',
  });

  await instance.application.init();

  return {
    application: instance.application,
    module: instance.module,
  };
}

async function create(options: Options): Promise<{
  application: INestApplication;
  module: TestingModule;
}> {
  const imports = [...(options.metadata?.imports ?? []), AppModule];

  imports.push(
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      ignoreEnvVars: false,
    }),
  );

  if (options.dbSchema) {
    const connection = await createDatabase(options.dbSchema);
    imports.push(TypeOrmModule.forRoot(connection.options as never));
  }

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

  if (options.disableLogging) {
    builder.setLogger(new NoOutputLogger());
  } else {
    builder.setLogger(console);
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

  return { application, module };
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
    // Create database if it does not exist (ignoring errors if it does)
    await client.query(oneLine`
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
  const connection = await createConnection(connectionOptions);

  // Seed the database fixtures
  await seed(connection);

  // Close default connection, Nest will open a new one
  await connection.close();

  return connection;
}
