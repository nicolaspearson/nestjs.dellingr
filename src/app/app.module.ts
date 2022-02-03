import { Module } from '@nestjs/common';

import { AppService } from '$/app/app.service';
import { AuthModule } from '$/auth/auth.module';
import { AwsS3SeederModule } from '$/aws/s3-seeder/aws-s3-seeder.module';
import { DatabaseSeederService } from '$/db/services/database-seeder.service';
import { DocumentModule } from '$/document/document.module';
import { HealthModule } from '$/health/health.module';
import { TransactionModule } from '$/transaction/transaction.module';
import { UserModule } from '$/user/user.module';
import { WalletModule } from '$/wallet/wallet.module';

@Module({
  imports: [
    AuthModule,
    AwsS3SeederModule,
    DocumentModule,
    HealthModule,
    TransactionModule,
    UserModule,
    WalletModule,
  ],
  providers: [AppService, DatabaseSeederService],
})
export class AppModule {}
