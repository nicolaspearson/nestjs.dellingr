import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { getValidationSchema } from '$/common/config/environment.config';
import { HealthModule } from '$/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
      validationSchema: getValidationSchema(),
    }),
    HealthModule,
  ],
})
export class MainModule {}
