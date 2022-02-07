import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '$/common/config/config.service';
import { WalletResponse } from '$/common/dto';
import { WalletController } from '$/wallet/wallet.controller';
import { WalletService } from '$/wallet/wallet.service';

import { configService } from '#/utils/config';
import {
  authenticatedRequestMock,
  createWalletRequestMock,
  walletMockMain,
  walletMockSecondary,
} from '#/utils/fixtures';
import { walletMockService } from '#/utils/mocks/service.mock';

describe('Wallet Controller', () => {
  let module: TestingModule;
  let controller: WalletController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [WalletController],
      providers: [
        { provide: ConfigService, useValue: configService },
        { provide: WalletService, useValue: walletMockService },
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('should allow a user to create a new wallet', async () => {
      const result = await controller.create(authenticatedRequestMock, createWalletRequestMock);
      expect(result).toMatchObject(new WalletResponse(walletMockSecondary));
      expect(walletMockService.create).toHaveBeenCalledWith(
        authenticatedRequestMock.userUuid,
        createWalletRequestMock,
      );
    });
  });

  describe('getById', () => {
    test('should allow a user to retrieve a wallet by id', async () => {
      const result = await controller.getById(authenticatedRequestMock, {
        id: walletMockMain.uuid,
      });
      expect(result).toMatchObject(new WalletResponse(walletMockMain));
      expect(walletMockService.getById).toHaveBeenCalledWith(
        authenticatedRequestMock.userUuid,
        walletMockMain.uuid,
      );
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
