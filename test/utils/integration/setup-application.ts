import helmet from 'helmet';

import { ExceptionFilter, INestApplication, ValidationPipe } from '@nestjs/common';
import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule, TestingModuleBuilder } from '@nestjs/testing';

import { MainModule } from '$/main.module';

import { NoOutputLogger } from '#/utils/integration/no-output.logger';

export interface Options {
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

  await instance.application.listen('3000', 'localhost');

  return {
    application: instance.application,
    module: instance.module,
  };
}

async function create(options: Options): Promise<{
  application: INestApplication;
  module: TestingModule;
}> {
  const imports = [...(options.metadata?.imports ?? []), MainModule];

  imports.push(
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      ignoreEnvVars: false,
    }),
  );

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
