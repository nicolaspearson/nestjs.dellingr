import Joi from 'joi';

import { Environment } from '$/common/enum/environment.enum';

// Joi object keys follow the UPPER snake case convention.
/* eslint-disable @typescript-eslint/naming-convention */
export function getValidationSchema(): Joi.ObjectSchema {
  return Joi.object({
    API_HOST: Joi.string().hostname().description('The server host url').default('localhost'),
    API_PORT: Joi.number().port().description('The server port').default(3000),
    AWS_ACCESS_KEY_ID: Joi.string().description('The access key id for the AWS user.').required(),
    AWS_ENDPOINT: Joi.string().uri().optional().allow('').description('The optional AWS endpoint'),
    AWS_REGION: Joi.string().description('The AWS region').required(),
    AWS_SECRET_ACCESS_KEY: Joi.string()
      .description('The secret access key for the AWS user.')
      .required(),
    AWS_S3_BUCKET_NAME: Joi.string().description('The name of the AWS S3 bucket.').required(),
    ENVIRONMENT: Joi.string()
      .valid(Environment.Development, Environment.Staging, Environment.Production, Environment.Test)
      .description('The pre-defined deployment environment')
      .required(),
    JWT_ALGORITHM: Joi.string()
      .valid('HS256')
      .description('The algorithm used to encode the JWT')
      .default('HS256'),
    JWT_ISSUER: Joi.string().description('The JWT issuer').default('support@granite.com'),
    JWT_SECRET: Joi.string().description('The JWT signing secret').example('secretKey').required(),
    JWT_TOKEN_EXPIRATION: Joi.string()
      .regex(/^\d+[dhms]$/)
      .description('The validity period of the JWT token')
      .default('15m'),
    LOG_LEVEL: Joi.string()
      .description('Log verbosity')
      .valid('verbose', 'debug', 'log', 'warn', 'error')
      .default('error'),
    NODE_ENV: Joi.string()
      .valid(Environment.Development, Environment.Production)
      .description('The Node runtime environment')
      .default(Environment.Development),
    SEED_ENVIRONMENT: Joi.boolean()
      .description('Whether or not the environment should be seeded')
      .default(false),
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
