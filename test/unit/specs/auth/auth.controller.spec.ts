import { Test, TestingModule } from '@nestjs/testing';

import { AuthController } from '$/auth/auth.controller';
import { AuthService } from '$/auth/auth.service';
import { JwtResponse } from '$/common/dto';

import { jwtTokenMock, loginRequestMock } from '#/utils/fixtures';
import { authMockService } from '#/utils/mocks/service.mock';

describe('Auth Controller', () => {
  let module: TestingModule;
  let controller: AuthController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authMockService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('authenticate', () => {
    test('should allow a user to authenticate', async () => {
      const { email, password } = loginRequestMock;
      const result = await controller.authenticate(loginRequestMock);
      expect(result).toMatchObject(new JwtResponse({ token: jwtTokenMock }));
      expect(authMockService.authenticate).toHaveBeenCalledWith(email, password);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
