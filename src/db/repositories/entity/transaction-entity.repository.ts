import { AbstractRepository, EntityManager, EntityRepository, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable } from '@nestjs/common';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import Transaction from '$/db/entities/transaction.entity';

@Injectable()
@EntityRepository(Transaction)
export class TransactionEntityRepository extends AbstractRepository<Transaction> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  private query(): SelectQueryBuilder<Transaction> {
    return this.manager.createQueryBuilder(Transaction, 'transaction');
  }

  create(data: {
    amount: number;
    reference: string;
    state: TransactionState;
    type: TransactionType;
    walletUuid: Uuid;
  }): Promise<Api.Entities.Transaction> {
    const partialTransaction: QueryDeepPartialEntity<Transaction> = {
      amount: data.amount,
      reference: data.reference,
      state: data.state,
      type: data.type,
      wallet: {
        uuid: data.walletUuid,
      },
    };
    return this.manager.save(Transaction, partialTransaction as Transaction);
  }

  findByUuid(data: { transactionUuid: Uuid; userUuid: Uuid }): Promise<Transaction | undefined> {
    return this.query()
      .where({ uuid: data.transactionUuid, wallet: { user: data.userUuid } })
      .getOne();
  }

  updateState(
    data: {
      state: TransactionState;
      transactionUuid: Uuid;
    },
    manager?: EntityManager,
  ): Promise<Api.Repositories.Responses.UpdateResult> {
    const entityManager = manager ?? this.manager;
    return entityManager
      .createQueryBuilder()
      .update(Transaction)
      .set({ state: data.state })
      .where({
        uuid: data.transactionUuid,
      })
      .execute();
  }
}
