import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { getValidationSchema } from '$/common/config/environment.config';
import { TypeOrmConfigService } from '$/common/config/typeorm.config';
import { HealthModule } from '$/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: getValidationSchema(),
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    HealthModule,
  ],
})
export class MainModule {}
