import { TypedConfigModule, dotenvLoader, selectConfig } from 'nest-typed-config';

import { ConfigService } from '$/common/config/config.service';
import { configValidator } from '$/common/validators/config.validator';

export const typedConfigModule = TypedConfigModule.forRoot({
  isGlobal: true,
  load: dotenvLoader({
    ignoreEnvFile: true,
    ignoreEnvVars: false,
  }),
  schema: ConfigService,
  validate: configValidator,
});

export const configService = selectConfig(typedConfigModule, ConfigService);
