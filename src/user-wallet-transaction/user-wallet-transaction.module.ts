import { Module } from '@nestjs/common';

import { UserWalletTransactionRepository } from '$/db/repositories/user-wallet-transaction.repository';
import { UserWalletTransactionService } from '$/user-wallet-transaction/user-wallet-transaction.service';

@Module({
  exports: [UserWalletTransactionService],
  providers: [UserWalletTransactionRepository, UserWalletTransactionService],
})
export class UserWalletTransactionModule {}
