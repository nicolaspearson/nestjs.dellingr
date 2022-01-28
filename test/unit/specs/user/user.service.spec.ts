/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { DEFAULT_WALLET_BALANCE, DEFAULT_WALLET_NAME } from '$/common/constants';
import { ConflictError, NotFoundError } from '$/common/error';
import { UserRepository } from '$/db/repositories/user.repository';
import { UserService } from '$/user/user.service';

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

  describe('profile', () => {
    test('should allow a user to retrieve their profile', async () => {
      userMockRepo.findByUuidOrFail?.mockResolvedValueOnce(userMockJohn);
      const result = await service.profile(userMockJohn.uuid);
      expect(result).toMatchObject(userMockJohn);
      expect(userMockRepo.findByUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
      });
    });

    test('throws when the user does not exist', async () => {
      userMockRepo.findByUuidOrFail?.mockRejectedValueOnce(
        new NotFoundError('User does not exist.'),
      );
      await expect(service.profile(userMockJohn.uuid)).rejects.toThrowError(NotFoundError);
      expect(userMockRepo.findByUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
      });
    });
  });

  describe('register', () => {
    test('should allow a user to register', async () => {
      const { email, password } = userRegistrationRequestMock;
      const result = await service.register(email, password);
      expect(result).toMatchObject(userMockJohn);
      expect(userMockRepo.create).toHaveBeenCalledWith({
        email,
        password,
        wallet: { balance: DEFAULT_WALLET_BALANCE, name: DEFAULT_WALLET_NAME },
      });
    });

    test("throws when the user's email address already exists", async () => {
      userMockRepo.create?.mockRejectedValueOnce(new Error('User already exists!'));
      const { email, password } = userRegistrationRequestMock;
      await expect(service.register(email, password)).rejects.toThrowError(ConflictError);
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
