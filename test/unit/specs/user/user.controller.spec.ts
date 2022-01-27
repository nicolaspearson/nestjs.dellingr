import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from '$/user/user.controller';
import { UserService } from '$/user/user.service';

import {
  authenticatedRequestMock,
  responseMock,
  userMockJohn,
  userProfileResponseMock,
  userRegistrationRequestMock,
} from '#/utils/fixtures';
import { userMockService } from '#/utils/mocks/service.mock';

describe('User Controller', () => {
  let module: TestingModule;
  let controller: UserController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: userMockService }],
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
      const { email, password } = userRegistrationRequestMock;
      await controller.register(responseMock, userRegistrationRequestMock);
      expect(userMockService.register).toHaveBeenCalledWith(email, password);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
