import { Module } from '@nestjs/common';

import { RepositoryModule } from '$/db/repositories';
import { TransactionController } from '$/transaction/transaction.controller';
import { TransactionService } from '$/transaction/transaction.service';

@Module({
  controllers: [TransactionController],
  imports: [RepositoryModule],
  providers: [TransactionService],
})
export class TransactionModule {}
