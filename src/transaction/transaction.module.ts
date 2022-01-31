import { Module } from '@nestjs/common';

import { DatabaseModule } from '$/db/database.module';
import { TransactionController } from '$/transaction/transaction.controller';
import { TransactionService } from '$/transaction/transaction.service';

@Module({
  controllers: [TransactionController],
  imports: [DatabaseModule],
  providers: [TransactionService],
})
export class TransactionModule {}
