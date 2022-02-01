import { Test, TestingModule } from '@nestjs/testing';

import { ConflictError, InternalServerError } from '$/common/error';
import { UnitOfWorkService } from '$/db/services';
import { UserController } from '$/user/user.controller';
import { UserService } from '$/user/user.service';

import {
  authenticatedRequestMock,
  userMockJohn,
  userProfileResponseMock,
  userRegistrationRequestMock,
} from '#/utils/fixtures';
import { unitOfWorkMockService, userMockService } from '#/utils/mocks/service.mock';

describe('User Controller', () => {
  let module: TestingModule;
  let controller: UserController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UnitOfWorkService,
          useValue: unitOfWorkMockService,
        },
        { provide: UserService, useValue: userMockService },
      ],
    }).compile();
    controller = module.get<UserController>(UserController);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('delete', () => {
    test('should allow a user to delete their account', async () => {
      await controller.delete(authenticatedRequestMock);
      expect(userMockService.delete).toHaveBeenCalledWith(userMockJohn.uuid);
    });
  });

  describe('profile', () => {
    test('should allow a user to retrieve their profile', async () => {
      const result = await controller.profile(authenticatedRequestMock);
      expect(result).toMatchObject(userProfileResponseMock);
      expect(userMockService.profile).toHaveBeenCalledWith(authenticatedRequestMock.userUuid);
    });
  });

  describe('register', () => {
    test('should allow a user to register', async () => {
      await controller.register(userRegistrationRequestMock);
      expect(unitOfWorkMockService.doTransactional).toHaveBeenCalledTimes(1);
    });

    test('should swallow conflict errors to avoid user enumeration attacks.', async () => {
      unitOfWorkMockService.doTransactional.mockRejectedValueOnce(
        new ConflictError('User already exists.'),
      );
      await controller.register(userRegistrationRequestMock);
      expect(unitOfWorkMockService.doTransactional).toHaveBeenCalledTimes(1);
    });

    test('throws if an internal service error occurs', async () => {
      unitOfWorkMockService.doTransactional.mockRejectedValueOnce(
        new InternalServerError('An unexpected error occurred.'),
      );
      await expect(controller.register(userRegistrationRequestMock)).rejects.toThrowError(
        InternalServerError,
      );
      expect(unitOfWorkMockService.doTransactional).toHaveBeenCalledTimes(1);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
