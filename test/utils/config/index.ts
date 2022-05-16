import {
  TypedConfigModuleExtended,
  dotenvLoaderExtended,
  selectConfig,
} from 'nest-typed-config-extended';

import { ConfigService } from '$/common/config/config.service';
import { DatabaseConfig } from '$/common/config/database/database.config';

export const typedConfigModule = TypedConfigModuleExtended.forRoot({
  isGlobal: true,
  load: dotenvLoaderExtended({
    ignoreEnvFile: true,
    ignoreEnvVars: false,
    separator: '__',
    transformFromUpperSnakeCase: true,
  }),
  schema: ConfigService,
});

export const configService = selectConfig(typedConfigModule, ConfigService);
export const databaseConfig = selectConfig(typedConfigModule, DatabaseConfig);
