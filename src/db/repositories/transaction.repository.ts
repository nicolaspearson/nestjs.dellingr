import { Connection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import Transaction from '$/db/entities/transaction.entity';
import { TransactionEntityRepository } from '$/db/repositories/core/transaction-entity.repository';

@Injectable()
export class TransactionRepository {
  // Core
  public readonly transactionEntityRepository: TransactionEntityRepository;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    this.transactionEntityRepository = new TransactionEntityRepository(this.connection.manager);
  }

  findByUuid(uuid: Uuid): Promise<Transaction | undefined> {
    return this.transactionEntityRepository.findByUuid(uuid);
  }
}
