import { mocked } from 'jest-mock';

import { AuthService } from '$/auth/auth.service';
import { DatabaseTransactionService } from '$/db/services/database-transaction.service';
import { TokenService } from '$/token/token.service';
import { TransactionService } from '$/transaction/transaction.service';
import { UserService } from '$/user/user.service';
import { WalletService } from '$/wallet/wallet.service';

import {
  jwtTokenMock,
  transactionMockPayedAlice,
  userMockJohn,
  walletMockMain,
  walletMockSecondary,
} from '#/utils/fixtures';

export const authMockService = mocked<PublicOnly<AuthService>>(
  {
    authenticate: jest.fn().mockResolvedValue(jwtTokenMock),
  },
  true,
);

export const tokenMockService = mocked<PublicOnly<TokenService>>(
  {
    generate: jest.fn().mockResolvedValue(jwtTokenMock),
  },
  true,
);

export const transactionMockService = mocked<PublicOnly<TransactionService>>(
  {
    create: jest.fn().mockResolvedValue(transactionMockPayedAlice),
    getById: jest.fn().mockResolvedValue(transactionMockPayedAlice),
  },
  true,
);

export const databaseTransactionMockService = mocked<PublicOnly<DatabaseTransactionService>>(
  {
    execute: jest.fn().mockResolvedValue(undefined),
    executeHandler: jest.fn().mockResolvedValue(undefined),
    getManager: jest.fn().mockResolvedValue(undefined),
  },
  true,
);

export const userMockService = mocked<PublicOnly<UserService>>(
  {
    delete: jest.fn().mockResolvedValue(undefined),
    register: jest.fn().mockResolvedValue(undefined),
    profile: jest.fn().mockResolvedValue(userMockJohn),
  },
  true,
);

export const walletMockService = mocked<PublicOnly<WalletService>>(
  {
    create: jest.fn().mockResolvedValue(walletMockSecondary),
    getById: jest.fn().mockResolvedValue(walletMockMain),
  },
  true,
);
