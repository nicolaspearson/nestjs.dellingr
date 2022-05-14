import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigModuleExtended, dotenvLoaderExtended } from 'nest-typed-config-extended';

import { AppModule } from '$/app/app.module';
import { ConfigService } from '$/common/config/config.service';
import { TypeOrmConfigService } from '$/db/config/typeorm-config.service';

@Module({
  imports: [
    AppModule,
    TypedConfigModuleExtended.forRoot({
      isGlobal: true,
      load: dotenvLoaderExtended({
        envFilePath: ['.env'],
        separator: '__',
        transformFromUpperSnakeCase: true,
      }),
      schema: ConfigService,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class MainModule {}
