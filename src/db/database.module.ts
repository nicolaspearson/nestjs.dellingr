import { Module } from '@nestjs/common';

import {
  DocumentRepository,
  TransactionRepository,
  UserRepository,
  WalletRepository,
} from './repositories';
import { DatabaseTransactionService } from './services/database-transaction.service';

@Module({
  exports: [
    DocumentRepository,
    TransactionRepository,
    DatabaseTransactionService,
    UserRepository,
    WalletRepository,
  ],
  providers: [
    DocumentRepository,
    TransactionRepository,
    DatabaseTransactionService,
    UserRepository,
    WalletRepository,
  ],
})
export class DatabaseModule {}
