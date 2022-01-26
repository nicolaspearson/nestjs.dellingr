import { mocked } from 'jest-mock';

import { AuthService } from '$/auth/auth.service';
import { TokenService } from '$/token/token.service';
import { UserWalletTransactionService } from '$/user-wallet-transaction/user-wallet-transaction.service';
import { UserWalletService } from '$/user-wallet/user-wallet.service';
import { UserService } from '$/user/user.service';

import { jwtResponseMock, jwtTokenMock, userMock, userProfileResponseMock } from '#/utils/fixtures';

export const authMockService = mocked<
  Omit<AuthService, 'logger' | 'tokenService' | 'userService' | 'generateJwt'>
>(
  {
    authenticate: jest.fn().mockResolvedValue(jwtResponseMock),
  },
  true,
);

export const tokenMockService = mocked<
  Omit<TokenService, 'logger' | 'tokenExpiration' | 'configService' | 'jwtService'>
>(
  {
    generate: jest.fn().mockResolvedValue(jwtTokenMock),
  },
  true,
);

export const userMockService = mocked<Omit<UserService, 'logger' | 'userRepository'>>(
  {
    delete: jest.fn().mockResolvedValue(undefined),
    findByValidCredentials: jest.fn().mockResolvedValue(userMock),
  },
  true,
);

export const userWalletMockService = mocked<
  Omit<UserWalletService, 'logger' | 'userWalletRepository'>
>(
  {
    register: jest.fn().mockResolvedValue(undefined),
  },
  true,
);

export const userWalletTransactionMockService = mocked<
  Omit<
    UserWalletTransactionService,
    'logger' | 'userWalletTransactionRepository' | 'findByUserUuidOrFail'
  >
>(
  {
    profile: jest.fn().mockResolvedValue(userProfileResponseMock),
  },
  true,
);
