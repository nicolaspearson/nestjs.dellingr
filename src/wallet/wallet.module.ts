import { Module } from '@nestjs/common';

import { WalletRepository } from '$/db/repositories/wallet.repository';
import { WalletController } from '$/wallet/wallet.controller';
import { WalletService } from '$/wallet/wallet.service';

@Module({
  controllers: [WalletController],
  providers: [WalletRepository, WalletService],
})
export class WalletModule {}
