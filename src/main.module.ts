import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';

import { AppModule } from '$/app/app.module';
import { Config } from '$/common/config/environment.config';
import { TypeOrmConfigService } from '$/common/config/typeorm.config';
import { configValidator } from '$/common/validators/config.validator';

@Module({
  imports: [
    AppModule,
    TypedConfigModule.forRoot({
      isGlobal: true,
      load: dotenvLoader({
        envFilePath: ['.env'],
      }),
      schema: Config,
      validate: configValidator,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class MainModule {}
