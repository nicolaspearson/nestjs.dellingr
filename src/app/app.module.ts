import { Module } from '@nestjs/common';

import { AuthModule } from '$/auth/auth.module';
import { HealthModule } from '$/health/health.module';
import { UserModule } from '$/user/user.module';

@Module({
  imports: [AuthModule, HealthModule, UserModule],
})
export class AppModule {}
