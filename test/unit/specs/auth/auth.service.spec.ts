import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from '$/auth/auth.service';
import { InternalServerError, NotFoundError } from '$/common/error';
import { UserRepository } from '$/db/repositories';
import { TokenService } from '$/token/token.service';

import { jwtPayloadMock, jwtTokenMock, loginRequestMock, userMockJohn } from '#/utils/fixtures';
import { userMockRepo } from '#/utils/mocks/repo.mock';
import { tokenMockService } from '#/utils/mocks/service.mock';

describe('Auth Service', () => {
  let module: TestingModule;
  let service: AuthService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: tokenMockService,
        },
        {
          provide: UserRepository,
          useValue: userMockRepo,
        },
        AuthService,
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticate', () => {
    test('should allow a user to authenticate', async () => {
      const { email, password } = loginRequestMock;
      const result = await service.authenticate(email, password);
      expect(result).toEqual(jwtTokenMock);
      expect(userMockRepo.findByValidCredentials).toHaveBeenCalledWith({ email, password });
      expect(tokenMockService.generate).toHaveBeenCalledWith(jwtPayloadMock);
    });

    test("throws when the user's credentials are invalid", async () => {
      userMockRepo.findByValidCredentials.mockResolvedValueOnce(undefined);
      const { email, password } = loginRequestMock;
      await expect(service.authenticate(email, password)).rejects.toThrowError(NotFoundError);
      expect(userMockRepo.findByValidCredentials).toHaveBeenCalledWith({ email, password });
      expect(tokenMockService.generate).not.toHaveBeenCalled();
    });

    test('throws when jwt generation fails', async () => {
      userMockRepo.findByValidCredentials.mockResolvedValueOnce(userMockJohn);
      tokenMockService.generate?.mockRejectedValueOnce(
        new InternalServerError('Jwt generation failed'),
      );
      const { email, password } = loginRequestMock;
      await expect(service.authenticate(email, password)).rejects.toThrowError(InternalServerError);
      expect(userMockRepo.findByValidCredentials).toHaveBeenCalledWith({ email, password });
      expect(tokenMockService.generate).toHaveBeenCalledWith(jwtPayloadMock);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
