import { Module } from '@nestjs/common';

import { DatabaseModule } from '$/db/database.module';
import { WalletController } from '$/wallet/wallet.controller';
import { WalletService } from '$/wallet/wallet.service';

@Module({
  controllers: [WalletController],
  imports: [DatabaseModule],
  providers: [WalletService],
})
export class WalletModule {}
