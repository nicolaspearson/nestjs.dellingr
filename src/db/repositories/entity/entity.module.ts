import { Module } from '@nestjs/common';

import { TransactionEntityRepository } from './transaction-entity.repository';
import { UserEntityRepository } from './user-entity.repository';
import { WalletEntityRepository } from './wallet-entity.repository';

@Module({
  exports: [TransactionEntityRepository, UserEntityRepository, WalletEntityRepository],
  providers: [TransactionEntityRepository, UserEntityRepository, WalletEntityRepository],
})
export class EntityModule {}
