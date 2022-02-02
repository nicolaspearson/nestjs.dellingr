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
    DatabaseTransactionService,
    DocumentRepository,
    TransactionRepository,
    UserRepository,
    WalletRepository,
  ],
  providers: [
    DatabaseTransactionService,
    DocumentRepository,
    TransactionRepository,
    UserRepository,
    WalletRepository,
  ],
})
export class DatabaseModule {}
