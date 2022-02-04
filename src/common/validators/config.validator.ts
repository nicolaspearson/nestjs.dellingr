import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { TypedConfigModule } from 'nest-typed-config';

import { Config } from '$/common/config/environment.config';

export function configValidator(rawConfig: Record<string, string>): Config {
  // Convert all environment variables from upper snake
  // case to camel case, e.g. from NODE_ENV to nodeEnv.
  const camelCaseConfig: Record<string, string> = {};
  for (const entry of Object.entries(rawConfig)) {
    camelCaseConfig[snakeCaseToCamelCase(entry[0])] = entry[1];
  }

  // Convert the config object to it's class equivalent.
  const config = plainToInstance(Config, camelCaseConfig);
  const schemaErrors = validateSync(config, {
    forbidUnknownValues: true,
    whitelist: true,
  });

  // Check for errors
  if (schemaErrors.length > 0) {
    console.log(TypedConfigModule.getConfigErrorMessage(schemaErrors));
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(1);
  }

  // Return the validated and transformed config.
  return config;
}

function snakeCaseToCamelCase(value: string): string {
  return value.toLowerCase().replace(/(_[a-z])/g, (group) => group.toUpperCase().replace('_', ''));
}
