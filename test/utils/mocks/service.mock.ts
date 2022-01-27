import { mocked } from 'jest-mock';

import { AuthService } from '$/auth/auth.service';
import { TokenService } from '$/token/token.service';
import { TransactionService } from '$/transaction/transaction.service';
import { UserService } from '$/user/user.service';
import { WalletService } from '$/wallet/wallet.service';

import {
  jwtResponseMock,
  jwtTokenMock,
  transactionMockPayedAlice,
  userMockJohn,
  walletMockSecondary,
} from '#/utils/fixtures';

export const authMockService = mocked<PublicOnly<AuthService>>(
  {
    authenticate: jest.fn().mockResolvedValue(jwtResponseMock),
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
    getById: jest.fn().mockResolvedValue(transactionMockPayedAlice),
  },
  true,
);

export const userMockService = mocked<PublicOnly<UserService>>(
  {
    delete: jest.fn().mockResolvedValue(undefined),
    findByValidCredentials: jest.fn().mockResolvedValue(userMockJohn),
    register: jest.fn().mockResolvedValue(undefined),
    profile: jest.fn().mockResolvedValue(userMockJohn),
  },
  true,
);

export const walletMockService = mocked<PublicOnly<WalletService>>(
  {
    create: jest.fn().mockResolvedValue(walletMockSecondary),
    getById: jest.fn().mockResolvedValue(undefined),
  },
  true,
);
