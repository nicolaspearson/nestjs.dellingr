import { dotenvLoader } from 'nest-typed-config';

import { Environment } from '$/common/enum/environment.enum';
import { configValidator } from '$/common/validators/config.validator';

describe('Config Validator', () => {
  test('should transform and validate an environment config correctly', () => {
    const environmentVariables = dotenvLoader({
      ignoreEnvFile: true,
      ignoreEnvVars: false,
    })();
    expect(configValidator(environmentVariables)).toMatchObject({
      environment: Environment.Test,
      nodeEnv: Environment.Development,
    });
  });
});
