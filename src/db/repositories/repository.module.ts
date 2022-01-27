import { Module } from '@nestjs/common';

import { AggregateModule } from './aggregate/aggregate.module';
import { EntityModule } from './entity/entity.module';
import { TransactionRepository } from './transaction.repository';
import { UserRepository } from './user.repository';
import { WalletRepository } from './wallet.repository';

@Module({
  exports: [TransactionRepository, UserRepository, WalletRepository],
  imports: [AggregateModule, EntityModule],
  providers: [TransactionRepository, UserRepository, WalletRepository],
})
export class RepositoryModule {}
