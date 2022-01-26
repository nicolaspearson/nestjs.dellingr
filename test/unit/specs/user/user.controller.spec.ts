import { Test, TestingModule } from '@nestjs/testing';

import { UserWalletTransactionService } from '$/user-wallet-transaction/user-wallet-transaction.service';
import { UserWalletService } from '$/user-wallet/user-wallet.service';
import { UserController } from '$/user/user.controller';
import { UserService } from '$/user/user.service';

import {
  authenticatedRequestMock,
  responseMock,
  userMock,
  userProfileResponseMock,
  userRegistrationRequestMock,
} from '#/utils/fixtures';
import {
  userMockService,
  userWalletMockService,
  userWalletTransactionMockService,
} from '#/utils/mocks/service.mock';

describe('User Controller', () => {
  let module: TestingModule;
  let controller: UserController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: userMockService },
        { provide: UserWalletService, useValue: userWalletMockService },
        { provide: UserWalletTransactionService, useValue: userWalletTransactionMockService },
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
      expect(userMockService.delete).toHaveBeenCalledWith(userMock.uuid);
    });
  });

  describe('profile', () => {
    test('should allow a user to retrieve their profile', async () => {
      const result = await controller.profile(authenticatedRequestMock);
      expect(result).toMatchObject(userProfileResponseMock);
      expect(userWalletTransactionMockService.profile).toHaveBeenCalledWith(userMock.uuid);
    });
  });

  describe('register', () => {
    test('should allow a user to register', async () => {
      const { email, password } = userRegistrationRequestMock;
      await controller.register(responseMock, userRegistrationRequestMock);
      expect(userWalletMockService.register).toHaveBeenCalledWith(email, password);
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
