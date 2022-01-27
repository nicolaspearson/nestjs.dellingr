import { mocked } from 'jest-mock';

import {
  transactionMockPayedAlice,
  userMockJohn,
  walletMockMain,
  walletMockSecondary,
} from '#/utils/fixtures';

export const transactionMockRepo = mocked<Api.Repositories.Transaction>(
  {
    findByUuid: jest.fn().mockResolvedValue(transactionMockPayedAlice),
  },
  true,
);

export const userMockRepo = mocked<Api.Repositories.User>(
  {
    create: jest.fn().mockResolvedValue(userMockJohn),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findByUserUuid: jest.fn().mockResolvedValue(userMockJohn),
    findByValidCredentials: jest.fn().mockResolvedValue(userMockJohn),
  },
  true,
);

export const walletMockRepo = mocked<Api.Repositories.Wallet>(
  {
    create: jest.fn().mockResolvedValue(walletMockSecondary),
    findByWalletUuid: jest.fn().mockResolvedValue(walletMockMain),
  },
  true,
);
