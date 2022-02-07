import { sign } from 'jsonwebtoken';

import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypedConfigModule } from 'nest-typed-config';

import { ConfigService } from '$/common/config/environment.config';
import { UnauthorizedError } from '$/common/error';
import { JwtAuthGuard } from '$/common/guards/jwt-auth.guard';

import { configService } from '#/utils/config';
import { jwtResponseMock, userMockJohn } from '#/utils/fixtures';

const switchToHttpMock = {
  getRequest: jest.fn(),
  getResponse: jest.fn().mockReturnThis(),
  getNext: jest.fn().mockReturnThis(),
};

const contextMock = {
  getArgByIndex: jest.fn().mockReturnThis(),
  getArgs: jest.fn().mockReturnThis(),
  getClass: jest.fn().mockReturnThis(),
  getHandler: jest.fn().mockReturnThis(),
  getRequest: jest.fn().mockReturnThis(),
  getType: jest.fn().mockReturnThis(),
  switchToHttp: jest.fn(() => switchToHttpMock),
  switchToRpc: jest.fn().mockReturnThis(),
  switchToWs: jest.fn().mockReturnThis(),
} as ExecutionContext;

describe('Jwt Auth Guard', () => {
  let module: TestingModule;
  let guard: JwtAuthGuard;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [TypedConfigModule],
      providers: [{ provide: ConfigService, useValue: configService }, JwtAuthGuard],
    }).compile();
    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(guard).toBeDefined();
  });

  test('should throw if the jwt is not provided in the request', () => {
    switchToHttpMock.getRequest.mockReturnValueOnce({
      get: jest.fn(),
    });
    expect(() => guard.canActivate(contextMock)).toThrowError(UnauthorizedError);
  });

  test('should throw if jwt verification fails', () => {
    switchToHttpMock.getRequest.mockReturnValueOnce({
      get: jest.fn(() => `Bearer ${jwtResponseMock.token}`),
    });
    expect(() => guard.canActivate(contextMock)).toThrowError(UnauthorizedError);
  });

  test('should return true if the jwt is valid', () => {
    const jwt = sign({ uuid: userMockJohn.uuid } as Api.JwtPayload, configService.jwtSecret, {
      expiresIn: '15m',
    });
    switchToHttpMock.getRequest.mockReturnValueOnce({
      get: jest.fn(() => `Bearer ${jwt}`),
    });
    expect(guard.canActivate(contextMock)).toEqual(true);
  });
});
