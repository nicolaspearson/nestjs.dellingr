import { Module } from '@nestjs/common';

import { DatabaseTransactionService } from '$/common/services/database-transaction.service';

import { TransactionRepository } from './repositories/transaction.repository';
import { UserRepository } from './repositories/user.repository';
import { WalletRepository } from './repositories/wallet.repository';

@Module({
  exports: [TransactionRepository, DatabaseTransactionService, UserRepository, WalletRepository],
  providers: [TransactionRepository, DatabaseTransactionService, UserRepository, WalletRepository],
})
export class DatabaseModule {}
