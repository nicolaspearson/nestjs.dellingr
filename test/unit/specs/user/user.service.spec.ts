/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { DEFAULT_WALLET_BALANCE, DEFAULT_WALLET_NAME } from '$/common/constants';
import { ConflictError, NotFoundError } from '$/common/error';
import { UserRepository, WalletRepository } from '$/db/repositories';
import { UserService } from '$/user/user.service';

import { userMockJohn, userRegistrationRequestMock, walletMockMain } from '#/utils/fixtures';
import { userMockRepo, walletMockRepo } from '#/utils/mocks/repo.mock';

describe('User Service', () => {
  let module: TestingModule;
  let service: UserService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserRepository, useValue: userMockRepo },
        {
          provide: WalletRepository,
          useValue: walletMockRepo,
        },
        UserService,
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('delete', () => {
    test('should allow a user to delete their account', async () => {
      await service.delete(userMockJohn.uuid);
      expect(userMockRepo.delete).toHaveBeenCalledWith({ userUuid: userMockJohn.uuid });
    });
  });

  describe('processUserRegistration', () => {
    test('should process a user registration correctly', async () => {
      userMockRepo.create.mockResolvedValueOnce(userMockJohn);
      walletMockRepo.create.mockResolvedValueOnce(walletMockMain);
      const { email, password } = userRegistrationRequestMock;
      const result = await service['processUserRegistration'](email, password);
      expect(result).toMatchObject({
        ...userMockJohn,
        wallets: [walletMockMain],
      });
      expect(userMockRepo.create).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(walletMockRepo.create).toHaveBeenCalledWith({
        balance: DEFAULT_WALLET_BALANCE,
        name: DEFAULT_WALLET_NAME,
        userUuid: userMockJohn.uuid,
      });
    });
  });

  describe('profile', () => {
    test('should allow a user to retrieve their profile', async () => {
      userMockRepo.findByUserUuidOrFail?.mockResolvedValueOnce(userMockJohn);
      const result = await service.profile(userMockJohn.uuid);
      expect(result).toMatchObject(userMockJohn);
      expect(userMockRepo.findByUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
      });
    });

    test('throws when the user does not exist', async () => {
      userMockRepo.findByUserUuidOrFail?.mockRejectedValueOnce(
        new NotFoundError('User does not exist.'),
      );
      await expect(service.profile(userMockJohn.uuid)).rejects.toThrowError(NotFoundError);
      expect(userMockRepo.findByUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
      });
    });
  });

  describe('register', () => {
    test('should allow a user to register', async () => {
      userMockRepo.create.mockResolvedValueOnce(userMockJohn);
      walletMockRepo.create.mockResolvedValueOnce(walletMockMain);
      const { email, password } = userRegistrationRequestMock;
      const result = await service.register(email, password);
      expect(result).toMatchObject(userMockJohn);
      expect(userMockRepo.create).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(walletMockRepo.create).toHaveBeenCalledWith({
        balance: DEFAULT_WALLET_BALANCE,
        name: DEFAULT_WALLET_NAME,
        userUuid: userMockJohn.uuid,
      });
    });

    test("throws when the user's email address already exists", async () => {
      userMockRepo.create.mockRejectedValueOnce(new Error('User already exists!'));
      const { email, password } = userRegistrationRequestMock;
      await expect(service.register(email, password)).rejects.toThrowError(ConflictError);
      expect(userMockRepo.create).toHaveBeenCalledWith({
        email,
        password,
      });
      expect(walletMockRepo.create).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
/* eslint-enable @typescript-eslint/unbound-method */
