import { mocked } from 'jest-mock';

import { TransactionRepository } from '$/db/repositories/transaction.repository';
import { UserRepository } from '$/db/repositories/user.repository';
import { WalletRepository } from '$/db/repositories/wallet.repository';

import {
  transactionMockWithWallet,
  userMock,
  userMockWithWallet,
  walletMock,
} from '#/utils/fixtures';

export const transactionMockRepo = mocked<
  Omit<TransactionRepository, 'transactionEntityRepository'>
>(
  {
    findByUuid: jest.fn().mockResolvedValue(transactionMockWithWallet),
  },
  true,
);

export const userMockRepo = mocked<
  Omit<
    UserRepository,
    'userWalletRepository' | 'userWalletTransactionRepository' | 'userEntityRepository'
  >
>(
  {
    create: jest.fn().mockResolvedValue(userMockWithWallet),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findByUserUuid: jest.fn().mockResolvedValue(userMockWithWallet),
    findByValidCredentials: jest.fn().mockResolvedValue(userMock),
  },
  true,
);

export const walletMockRepo = mocked<
  Omit<WalletRepository, 'walletTransactionRepository' | 'walletEntityRepository'>
>(
  {
    create: jest.fn().mockResolvedValue(walletMock),
    findByWalletUuid: jest.fn().mockResolvedValue(walletMock),
  },
  true,
);
