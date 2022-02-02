import { Module } from '@nestjs/common';

import { TransactionRepository } from './repositories/transaction.repository';
import { UserRepository } from './repositories/user.repository';
import { WalletRepository } from './repositories/wallet.repository';
import { DatabaseTransactionService } from './services/database-transaction.service';

@Module({
  exports: [TransactionRepository, DatabaseTransactionService, UserRepository, WalletRepository],
  providers: [TransactionRepository, DatabaseTransactionService, UserRepository, WalletRepository],
})
export class DatabaseModule {}
