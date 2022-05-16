import { DynamicModule } from '@nestjs/common';
import {
  DotenvLoaderExtendedOptions,
  TypedConfigModuleExtended,
  dotenvLoaderExtended,
} from 'nest-typed-config-extended';

import { ConfigService } from '$/common/config/config.service';

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
