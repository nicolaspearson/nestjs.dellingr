import { Module } from '@nestjs/common';

import { WalletTransactionRepository } from '$/db/repositories/wallet-transaction.repository';
import { WalletTransactionService } from '$/wallet-transaction/wallet-transaction.service';

@Module({
  exports: [WalletTransactionService],
  providers: [WalletTransactionRepository, WalletTransactionService],
})
export class WalletTransactionModule {}
