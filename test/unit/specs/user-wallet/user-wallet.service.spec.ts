import { Test, TestingModule } from '@nestjs/testing';

import { BadRequestError } from '$/common/error';
import { UserWalletRepository } from '$/db/repositories/user-wallet.repository';
import { UserWalletService } from '$/user-wallet/user-wallet.service';

import { userRegistrationRequestMock } from '#/utils/fixtures';
import { userWalletMockRepo } from '#/utils/mocks/repo.mock';

describe('User Wallet Service', () => {
  let module: TestingModule;
  let service: UserWalletService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserWalletRepository, useValue: userWalletMockRepo },
        UserWalletService,
      ],
    }).compile();
    service = module.get<UserWalletService>(UserWalletService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    test('should allow a user to register', async () => {
      const { email, password } = userRegistrationRequestMock;
      await service.register(email, password);
      expect(userWalletMockRepo.create).toHaveBeenCalledWith({ email, password });
    });

    test("throws when the user's email address already exists", async () => {
      userWalletMockRepo.create?.mockRejectedValueOnce(new Error('User already exists!'));
      const { email, password } = userRegistrationRequestMock;
      await expect(service.register(email, password)).rejects.toThrowError(BadRequestError);
      expect(userWalletMockRepo.create).toHaveBeenCalledWith({ email, password });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
