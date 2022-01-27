import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import { walletFixtures } from '$/db/fixtures/wallet.fixture';

export const transactionFixtures: QueryDeepPartialEntity<Api.Entities.Transaction>[] = [
  {
    uuid: 'b514e04c-b3e7-4346-b9f9-41c9d66cf5e2' as Uuid,
    reference: 'Deposit',
    amount: 1000,
    state: TransactionState.Processed,
    type: TransactionType.Credit,
    wallet: { uuid: walletFixtures[0].uuid },
  },
  {
    uuid: '8c4bf666-bc2d-4816-86b0-928b81620526' as Uuid,
    reference: 'Pay Bob',
    amount: 125,
    state: TransactionState.Processed,
    type: TransactionType.Debit,
    wallet: { uuid: walletFixtures[0].uuid },
  },
];
