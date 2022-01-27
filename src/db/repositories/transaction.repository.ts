import { Connection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { TransactionEntityRepository } from '$/db/repositories/core/transaction-entity.repository';

@Injectable()
export class TransactionRepository implements Api.Repositories.Transaction {
  // Core
  public readonly transactionEntityRepository: TransactionEntityRepository;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    this.transactionEntityRepository = new TransactionEntityRepository(this.connection.manager);
  }

  findByUuid(data: { transactionUuid: Uuid }): Promise<Api.Entities.Transaction | undefined> {
    return this.transactionEntityRepository.findByUuid(data);
  }
}
