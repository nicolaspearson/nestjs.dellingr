import { Module } from '@nestjs/common';

import { TransactionRepository } from '$/db/repositories/transaction.repository';
import { TransactionController } from '$/transaction/transaction.controller';
import { TransactionService } from '$/transaction/transaction.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionRepository, TransactionService],
})
export class TransactionModule {}
