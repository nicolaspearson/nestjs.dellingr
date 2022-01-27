import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import { walletFixtures } from '$/db/fixtures/wallet.fixture';

export const transactionFixtures: QueryDeepPartialEntity<Api.Entities.Transaction>[] = [
  {
    reference: 'Deposit',
    amount: 1000,
    state: TransactionState.Processed,
    type: TransactionType.Credit,
    wallet: { uuid: walletFixtures[0].uuid },
  },
  {
    reference: 'Pay Bob',
    amount: 125,
    state: TransactionState.Processed,
    type: TransactionType.Debit,
    wallet: { uuid: walletFixtures[0].uuid },
  },
];
