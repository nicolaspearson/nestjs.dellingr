import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { TypedConfigModule } from 'nest-typed-config';

import { ConfigService } from '$/common/config/environment.config';

export function configValidator(rawConfig: Record<string, string>): ConfigService {
  // Convert all environment variables from upper snake
  // case to camel case, e.g. from NODE_ENV to nodeEnv.
  const camelCaseConfig: Record<string, string> = {};
  for (const entry of Object.entries(rawConfig)) {
    camelCaseConfig[snakeCaseToCamelCase(entry[0])] = entry[1];
  }

  // Convert the config object to it's class equivalent.
  const configService = plainToInstance(ConfigService, camelCaseConfig);
  const schemaErrors = validateSync(configService, {
    forbidUnknownValues: true,
    whitelist: true,
  });

  // Check for errors
  /* istanbul ignore next */
  if (schemaErrors.length > 0) {
    /* istanbul ignore next */
    console.log(TypedConfigModule.getConfigErrorMessage(schemaErrors));
    // eslint-disable-next-line unicorn/no-process-exit
    /* istanbul ignore next */ process.exit(1);
  }

  // Return the validated and transformed config.
  return configService;
}

function snakeCaseToCamelCase(value: string): string {
  return value.toLowerCase().replace(/(_[a-z])/g, (group) => group.toUpperCase().replace('_', ''));
}
