import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TransactionRepository } from '$/db/repositories/transaction.repository';
import { TransactionController } from '$/transaction/transaction.controller';
import { TransactionService } from '$/transaction/transaction.service';

@Module({
  controllers: [TransactionController],
  imports: [TypeOrmModule.forFeature([TransactionRepository])],
  providers: [TransactionService],
})
export class TransactionModule {}
