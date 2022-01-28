import { mocked } from 'jest-mock';

import {
  transactionMockPayedAlice,
  userMockJohn,
  walletMockMain,
  walletMockSecondary,
} from '#/utils/fixtures';

export const transactionMockRepo = mocked<Api.Repositories.Transaction>(
  {
    create: jest.fn().mockResolvedValue(transactionMockPayedAlice),
    findByUuid: jest.fn().mockResolvedValue(transactionMockPayedAlice),
    findByUuidOrFail: jest.fn().mockResolvedValue(transactionMockPayedAlice),
    process: jest.fn().mockResolvedValue(undefined),
    updateState: jest.fn().mockResolvedValue({ affected: 1 }),
  },
  true,
);

export const userMockRepo = mocked<Api.Repositories.User>(
  {
    create: jest.fn().mockResolvedValue(userMockJohn),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findByUuid: jest.fn().mockResolvedValue(userMockJohn),
    findByUuidOrFail: jest.fn().mockResolvedValue(userMockJohn),
    findByValidCredentials: jest.fn().mockResolvedValue(userMockJohn),
  },
  true,
);

export const walletMockRepo = mocked<Api.Repositories.Wallet>(
  {
    create: jest.fn().mockResolvedValue(walletMockSecondary),
    findByUuid: jest.fn().mockResolvedValue(walletMockMain),
    findByUuidOrFail: jest.fn().mockResolvedValue(walletMockMain),
  },
  true,
);
