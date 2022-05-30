import { DynamicModule } from '@nestjs/common';
import {
  DotenvLoaderExtendedOptions,
  TypedConfigModuleExtended,
  dotenvLoaderExtended,
  selectConfig,
} from 'nest-typed-config-extended';

import { ConfigService } from '$/common/config/config.service';
import { DatabaseConfig } from '$/common/config/database/database.config';

export function createTypedConfigModule(options?: DotenvLoaderExtendedOptions): DynamicModule {
  return TypedConfigModuleExtended.forRoot({
    isGlobal: true,
    load: dotenvLoaderExtended({
      envFilePath: ['.env'],
      separator: '__',
      transformFromUpperSnakeCase: true,
      ...options,
    }),
    schema: ConfigService,
  });
}

export const typedConfigModule = createTypedConfigModule();

export const configService = selectConfig(typedConfigModule, ConfigService);
export const databaseConfig = selectConfig(typedConfigModule, DatabaseConfig);
