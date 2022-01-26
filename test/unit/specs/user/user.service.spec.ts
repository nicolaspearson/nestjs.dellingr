import { Test, TestingModule } from '@nestjs/testing';

import User from '$/db/entities/user.entity';
import { UserRepository } from '$/db/repositories/user.repository';
import { UserService } from '$/user/user.service';

import { userMock } from '#/utils/fixtures';
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

  afterAll(async () => {
    await module.close();
  });
});
