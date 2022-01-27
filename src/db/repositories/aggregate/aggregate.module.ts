import { Module } from '@nestjs/common';

import { TransactionWalletUserRepository } from './transaction-wallet-user.repository';
import { UserWalletTransactionRepository } from './user-wallet-transaction.repository';
import { UserWalletRepository } from './user-wallet.repository';
import { WalletTransactionRepository } from './wallet-transaction.repository';

@Module({
  exports: [
    TransactionWalletUserRepository,
    UserWalletTransactionRepository,
    UserWalletRepository,
    WalletTransactionRepository,
  ],
  providers: [
    TransactionWalletUserRepository,
    UserWalletTransactionRepository,
    UserWalletRepository,
    WalletTransactionRepository,
  ],
})
export class AggregateModule {}
