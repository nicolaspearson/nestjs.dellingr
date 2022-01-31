import { Module } from '@nestjs/common';

import { TransactionRepository } from './repositories/transaction.repository';
import { UserRepository } from './repositories/user.repository';
import { WalletRepository } from './repositories/wallet.repository';
import { UnitOfWorkService } from './services';

@Module({
  exports: [TransactionRepository, UnitOfWorkService, UserRepository, WalletRepository],
  providers: [TransactionRepository, UnitOfWorkService, UserRepository, WalletRepository],
})
export class DatabaseModule {}
