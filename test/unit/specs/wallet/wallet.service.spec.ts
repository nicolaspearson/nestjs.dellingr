import { Test, TestingModule } from '@nestjs/testing';

import { DEFAULT_WALLET_BALANCE } from '$/common/constants';
import { UserRepository, WalletRepository } from '$/db/repositories';
import { WalletService } from '$/wallet/wallet.service';

import {
  createWalletRequestMock,
  userMockJohn,
  walletMockMain,
  walletMockSecondary,
} from '#/utils/fixtures';
import { userMockRepo, walletMockRepo } from '#/utils/mocks/repo.mock';

describe('Wallet Service', () => {
  let module: TestingModule;
  let service: WalletService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: UserRepository,
          useValue: userMockRepo,
        },
        {
          provide: WalletRepository,
          useValue: walletMockRepo,
        },
        WalletService,
      ],
    }).compile();
    service = module.get<WalletService>(WalletService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('should allow a user to create a new wallet', async () => {
      const result = await service.create(userMockJohn.uuid, createWalletRequestMock);
      expect(result).toMatchObject(walletMockSecondary);
      expect(userMockRepo.findByUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
      });
      expect(walletMockRepo.create).toHaveBeenCalledWith({
        balance: DEFAULT_WALLET_BALANCE,
        name: createWalletRequestMock.name,
        userUuid: userMockJohn.uuid,
      });
    });
  });

  describe('getById', () => {
    test('should allow a user to retrieve a specific wallet', async () => {
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMockMain);
      const result = await service.getById(userMockJohn.uuid, walletMockMain.uuid);
      expect(result).toMatchObject(walletMockMain);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMockMain.uuid,
      });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
