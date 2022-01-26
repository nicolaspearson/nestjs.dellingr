import { AbstractRepository, EntityManager, EntityRepository, SelectQueryBuilder } from 'typeorm';

import { Injectable } from '@nestjs/common';

import Transaction from '$/db/entities/transaction.entity';

@Injectable()
@EntityRepository(Transaction)
export class TransactionRepository extends AbstractRepository<Transaction> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  private query(): SelectQueryBuilder<Transaction> {
    return this.manager.createQueryBuilder(Transaction, 'transaction');
  }

  findByUuid(uuid: Uuid): Promise<Transaction | undefined> {
    return this.query().where({ uuid }).getOne();
  }
}
