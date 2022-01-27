/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { BadRequestError, NotFoundError } from '$/common/error';
import { UserRepository } from '$/db/repositories/user.repository';
import { DEFAULT_WALLET_BALANCE, DEFAULT_WALLET_NAME, UserService } from '$/user/user.service';

import { userMockJohn, userRegistrationRequestMock } from '#/utils/fixtures';
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
      await service.delete(userMockJohn.uuid);
      expect(userMockRepo.delete).toHaveBeenCalledWith({ userUuid: userMockJohn.uuid });
    });
  });

  describe('findByValidCredentials', () => {
    test('should retrieve the user that matches the provided credentials', async () => {
      userMockRepo.findByValidCredentials?.mockResolvedValueOnce(userMockJohn);
      const result = await service.findByValidCredentials(
        userMockJohn.email,
        userMockJohn.password,
      );
      expect(result).toMatchObject(userMockJohn);
      expect(userMockRepo.findByValidCredentials).toHaveBeenCalledWith({
        email: userMockJohn.email,
        password: userMockJohn.password,
      });
    });
  });

  describe('profile', () => {
    test('should allow a user to retrieve their profile (with events)', async () => {
      userMockRepo.findByUserUuid?.mockResolvedValueOnce(userMockJohn);
      const result = await service.profile(userMockJohn.uuid);
      expect(result).toMatchObject(userMockJohn);
      expect(userMockRepo.findByUserUuid).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
      });
    });

    test('throws when the user does not exist', async () => {
      userMockRepo.findByUserUuid?.mockResolvedValueOnce(undefined);
      await expect(service.profile(userMockJohn.uuid)).rejects.toThrowError(NotFoundError);
      expect(userMockRepo.findByUserUuid).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
      });
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
/* eslint-enable @typescript-eslint/unbound-method */
