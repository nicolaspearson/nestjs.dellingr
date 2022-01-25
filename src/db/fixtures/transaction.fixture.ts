import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import Transaction from '$/db/entities/transaction.entity';
import { walletFixtures } from '$/db/fixtures/wallet.fixture';

export const transactionFixtures: QueryDeepPartialEntity<Transaction>[] = [
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
