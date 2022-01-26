import { Module } from '@nestjs/common';

import { AuthModule } from '$/auth/auth.module';
import { HealthModule } from '$/health/health.module';
import { TransactionModule } from '$/transaction/transaction.module';
import { UserModule } from '$/user/user.module';
import { WalletModule } from '$/wallet/wallet.module';

@Module({
  imports: [AuthModule, HealthModule, TransactionModule, UserModule, WalletModule],
})
export class AppModule {}
