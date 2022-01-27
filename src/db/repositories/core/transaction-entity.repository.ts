import { AbstractRepository, EntityManager, EntityRepository, SelectQueryBuilder } from 'typeorm';

import Transaction from '$/db/entities/transaction.entity';

@EntityRepository(Transaction)
export class TransactionEntityRepository extends AbstractRepository<Transaction> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  private query(): SelectQueryBuilder<Transaction> {
    return this.manager.createQueryBuilder(Transaction, 'transaction');
  }

  findByUuid(data: { transactionUuid: Uuid }): Promise<Transaction | undefined> {
    return this.query().where({ uuid: data.transactionUuid }).getOne();
  }
}
