import { mocked } from 'jest-mock';

import { TransactionRepository } from '$/db/repositories/transaction.repository';
import { UserWalletTransactionRepository } from '$/db/repositories/user-wallet-transaction.repository';
import { UserWalletRepository } from '$/db/repositories/user-wallet.repository';
import { UserRepository } from '$/db/repositories/user.repository';
import { WalletRepository } from '$/db/repositories/wallet.repository';

import {
  transactionMockWithWallet,
  userMock,
  userMockWithWallet,
  walletMock,
} from '#/utils/fixtures';

export const transactionMockRepo = mocked<
  Omit<TransactionRepository, 'manager' | 'transactionQuery'>
>(
  {
    findByUuid: jest.fn().mockResolvedValue(transactionMockWithWallet),
  },
  true,
);

export const userMockRepo = mocked<Omit<UserRepository, 'manager' | 'userQuery'>>(
  {
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
    findByValidCredentials: jest.fn().mockResolvedValue(userMock),
  },
  true,
);

export const userWalletTransactionMockRepo = mocked<
  Omit<UserWalletTransactionRepository, 'connection' | 'userWalletQuery'>
>(
  {
    findByUserUuid: jest.fn().mockResolvedValue(userMockWithWallet),
  },
  true,
);

export const userWalletMockRepo = mocked<
  Omit<UserWalletRepository, 'connection' | 'userWalletQuery'>
>(
  {
    create: jest.fn().mockResolvedValue(userMockWithWallet),
  },
  true,
);

export const walletMockRepo = mocked<Omit<WalletRepository, 'manager' | 'walletQuery'>>(
  {
    findByUuid: jest.fn().mockResolvedValue(walletMock),
  },
  true,
);
