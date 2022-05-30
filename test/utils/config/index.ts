import { selectConfig } from 'nest-typed-config-extended';

import { ConfigService } from '$/common/config/config.service';
import { DatabaseConfig } from '$/common/config/database/database.config';
import { createTypedConfigModule } from '$/common/config/typed-config.module';

export const typedConfigModule = createTypedConfigModule({
  ignoreEnvFile: true,
  ignoreEnvVars: false,
});

export const configService = selectConfig(typedConfigModule, ConfigService);
export const databaseConfig = selectConfig(typedConfigModule, DatabaseConfig);
