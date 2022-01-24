import Joi from 'joi';

import { Environment } from '$/common/enum/environment.enum';

// Joi object keys follow the UPPER snake case convention.
/* eslint-disable @typescript-eslint/naming-convention */
export function getValidationSchema(): Joi.ObjectSchema {
  return Joi.object({
    API_HOST: Joi.string().hostname().description('The server host url').default('127.0.0.1'),
    API_PORT: Joi.number().port().description('The server port').default(3000),
    DATABASE_LOG_LEVEL: Joi.string()
      .description('Database log verbosity')
      .valid('query', 'info', 'warn', 'error')
      .default('error'),
    DATABASE_URL: Joi.string()
      .description('The database connection url.')
      .example('postgresql://admin:masterkey@localhost:5432/dellingr')
      .required(),
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
  });
}
/* eslint-enable @typescript-eslint/naming-convention */
