import { Test, TestingModule } from '@nestjs/testing';

import { UserProfileResponse } from '$/common/dto';
import { BadRequestError, NotFoundError } from '$/common/error';
import User from '$/db/entities/user.entity';
import { UserRepository } from '$/db/repositories/user.repository';
import { DEFAULT_WALLET_BALANCE, DEFAULT_WALLET_NAME, UserService } from '$/user/user.service';

import { userMock, userMockWithWallet, userRegistrationRequestMock } from '#/utils/fixtures';
import { userMockRepo } from '#/utils/mocks/repo.mock';

describe('User Service', () => {
  let module: TestingModule;
  let service: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [{ provide: UserRepository, useValue: userMockRepo }, UserService],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('delete', () => {
    test('should allow a user to delete their account', async () => {
      await service.delete(userMock.uuid);
      expect(userMockRepo.delete).toHaveBeenCalledWith(userMock.uuid);
    });
  });

  describe('findByValidCredentials', () => {
    test('should retrieve the user that matches the provided credentials', async () => {
      userMockRepo.findByValidCredentials?.mockResolvedValueOnce(userMock as User);
      const result = await service.findByValidCredentials(userMock.email, userMock.password);
      expect(result).toMatchObject(userMock);
      expect(userMockRepo.findByValidCredentials).toHaveBeenCalledWith(
        userMock.email,
        userMock.password,
      );
    });
  });

  describe('profile', () => {
    test('should allow a user to retrieve their profile (with events)', async () => {
      userMockRepo.findByUserUuid?.mockResolvedValueOnce(userMockWithWallet);
      const result = await service.profile(userMockWithWallet.uuid);
      expect(result).toMatchObject(new UserProfileResponse(userMockWithWallet));
      expect(userMockRepo.findByUserUuid).toHaveBeenCalledWith(userMockWithWallet.uuid);
    });

    test('throws when the user does not exist', async () => {
      userMockRepo.findByUserUuid?.mockResolvedValueOnce(undefined);
      await expect(service.profile(userMockWithWallet.uuid)).rejects.toThrowError(NotFoundError);
      expect(userMockRepo.findByUserUuid).toHaveBeenCalledWith(userMockWithWallet.uuid);
    });
  });

  describe('register', () => {
    test('should allow a user to register', async () => {
      const { email, password } = userRegistrationRequestMock;
      await service.register(email, password);
      expect(userMockRepo.create).toHaveBeenCalledWith({
        email,
        password,
        wallet: { balance: DEFAULT_WALLET_BALANCE, name: DEFAULT_WALLET_NAME },
      });
    });

    test("throws when the user's email address already exists", async () => {
      userMockRepo.create?.mockRejectedValueOnce(new Error('User already exists!'));
      const { email, password } = userRegistrationRequestMock;
      await expect(service.register(email, password)).rejects.toThrowError(BadRequestError);
      expect(userMockRepo.create).toHaveBeenCalledWith({
        email,
        password,
        wallet: { balance: DEFAULT_WALLET_BALANCE, name: DEFAULT_WALLET_NAME },
      });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
