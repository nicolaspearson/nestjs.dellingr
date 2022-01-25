import Joi from 'joi';

import { Environment } from '$/common/enum/environment.enum';

// Joi object keys follow the UPPER snake case convention.
/* eslint-disable @typescript-eslint/naming-convention */
export function getValidationSchema(): Joi.ObjectSchema {
  return Joi.object({
    API_HOST: Joi.string().hostname().description('The server host url').default('localhost'),
    API_PORT: Joi.number().port().description('The server port').default(3000),
    ENVIRONMENT: Joi.string()
      .valid(Environment.Development, Environment.Staging, Environment.Production, Environment.Test)
      .description('The pre-defined deployment environment')
      .required(),
    LOG_LEVEL: Joi.string()
      .description('Log verbosity')
      .valid('verbose', 'debug', 'log', 'warn', 'error')
      .default('error'),
    NODE_ENV: Joi.string()
      .valid(Environment.Development, Environment.Production)
      .description('The Node runtime environment')
      .default(Environment.Development),
    TYPEORM_CONNECTION: Joi.string()
      .valid('postgres')
      .description('The database connection type to be used by TypeORM')
      .valid('postgres')
      .default('postgres'),
    TYPEORM_DATABASE: Joi.string()
      .description('The database name to be used by TypeORM')
      .example('dellingr')
      .required(),
    TYPEORM_DROP_SCHEMA: Joi.boolean()
      .description('Whether or not TypeORM should drop schemas')
      .default(false),
    TYPEORM_ENTITIES: Joi.string()
      .description('The path to the entities to be used by TypeORM')
      .default('src/db/entities/*.ts'),
    TYPEORM_HOST: Joi.string()
      .hostname()
      .description('The database host to be used by TypeORM')
      .required(),
    TYPEORM_MIGRATIONS_DIR: Joi.string()
      .description('The path to the migrations dir to be used by TypeORM')
      .default('src/db/migrations'),
    TYPEORM_MIGRATIONS_RUN: Joi.boolean()
      .description('Whether or not TypeORM should run migrations')
      .default(true),
    TYPEORM_MIGRATIONS: Joi.string()
      .description('The path to the migrations to be used by TypeORM')
      .default('src/db/migrations/*.ts'),
    TYPEORM_PASSWORD: Joi.string()
      .description('The database password to be used by TypeORM')
      .example('masterkey')
      .required(),
    TYPEORM_PORT: Joi.number()
      .port()
      .description('The database port to be used by TypeORM')
      .example(5432)
      .required(),
    TYPEORM_SCHEMA: Joi.string()
      .description('The database schema to be used by TypeORM')
      .default('public'),
    TYPEORM_SYNCHRONIZE: Joi.boolean()
      .description('Whether or not TypeORM should synchronize the schema')
      .default(false),
    TYPEORM_USERNAME: Joi.string()
      .description('The database username to be used by TypeORM')
      .example('admin')
      .required(),
    TYPEORM_USE_WEBPACK: Joi.boolean()
      .description('Whether or not TypeORM should user webpack')
      .default(true),
  });
}
/* eslint-enable @typescript-eslint/naming-convention */
