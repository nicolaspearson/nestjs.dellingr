import { Module } from '@nestjs/common';

import { RepositoryModule } from '$/db/repositories';
import { WalletController } from '$/wallet/wallet.controller';
import { WalletService } from '$/wallet/wallet.service';

@Module({
  controllers: [WalletController],
  imports: [RepositoryModule],
  providers: [WalletService],
})
export class WalletModule {}
