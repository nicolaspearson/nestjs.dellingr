import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypedConfigModule, dotenvLoader } from 'nest-typed-config';

import { AppModule } from '$/app/app.module';
import { ConfigService } from '$/common/config/config.service';
import { TypeOrmConfigService } from '$/common/config/typeorm-config.service';
import { configValidator } from '$/common/validators/config.validator';

@Module({
  imports: [
    AppModule,
    TypedConfigModule.forRoot({
      isGlobal: true,
      load: dotenvLoader({
        envFilePath: ['.env'],
      }),
      schema: ConfigService,
      validate: configValidator,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
})
export class MainModule {}
