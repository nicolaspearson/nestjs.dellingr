import { Test, TestingModule } from '@nestjs/testing';

import { UserProfileResponse } from '$/common/dto';
import { NotFoundError } from '$/common/error';
import { UserWalletTransactionRepository } from '$/db/repositories/user-wallet-transaction.repository';
import { UserWalletTransactionService } from '$/user-wallet-transaction/user-wallet-transaction.service';

import { userMockWithWallet } from '#/utils/fixtures';
import { userWalletTransactionMockRepo } from '#/utils/mocks/repo.mock';

describe('User Wallet Transaction Service', () => {
  let module: TestingModule;
  let service: UserWalletTransactionService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        { provide: UserWalletTransactionRepository, useValue: userWalletTransactionMockRepo },
        UserWalletTransactionService,
      ],
    }).compile();
    service = module.get<UserWalletTransactionService>(UserWalletTransactionService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('profile', () => {
    test('should allow a user to retrieve their profile (with events)', async () => {
      userWalletTransactionMockRepo.findByUserUuid?.mockResolvedValueOnce(userMockWithWallet);
      const result = await service.profile(userMockWithWallet.uuid);
      expect(result).toMatchObject(new UserProfileResponse(userMockWithWallet));
      expect(userWalletTransactionMockRepo.findByUserUuid).toHaveBeenCalledWith(
        userMockWithWallet.uuid,
      );
    });

    test('throws when the user does not exist', async () => {
      userWalletTransactionMockRepo.findByUserUuid?.mockResolvedValueOnce(undefined);
      await expect(service.profile(userMockWithWallet.uuid)).rejects.toThrowError(NotFoundError);
      expect(userWalletTransactionMockRepo.findByUserUuid).toHaveBeenCalledWith(
        userMockWithWallet.uuid,
      );
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
