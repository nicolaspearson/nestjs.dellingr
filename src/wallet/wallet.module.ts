import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WalletRepository } from '$/db/repositories/wallet.repository';
import { WalletTransactionModule } from '$/wallet-transaction/wallet-transaction.module';
import { WalletController } from '$/wallet/wallet.controller';
import { WalletService } from '$/wallet/wallet.service';

@Module({
  controllers: [WalletController],
  imports: [TypeOrmModule.forFeature([WalletRepository]), WalletTransactionModule],
  providers: [WalletService],
})
export class WalletModule {}
