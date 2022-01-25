import { mocked } from 'jest-mock';

import { AuthService } from '$/auth/auth.service';
import { TokenService } from '$/token/token.service';
import { UserService } from '$/user/user.service';

import { jwtResponseMock, jwtTokenMock, userProfileResponseMock } from '#/utils/fixtures';

export const authMockService = mocked<Pick<AuthService, 'authenticate'>>(
  {
    authenticate: jest.fn().mockResolvedValue(jwtResponseMock),
  },
  true,
);

export const tokenMockService = mocked<Pick<TokenService, 'generate'>>(
  {
    generate: jest.fn().mockResolvedValue(jwtTokenMock),
  },
  true,
);

export const userMockService = mocked<Omit<UserService, 'logger' | 'userRepository'>>(
  {
    delete: jest.fn().mockResolvedValue(undefined),
    profile: jest.fn().mockResolvedValue(userProfileResponseMock),
    register: jest.fn().mockResolvedValue(undefined),
  },
  true,
);
