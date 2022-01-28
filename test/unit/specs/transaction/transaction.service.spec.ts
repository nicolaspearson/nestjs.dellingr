/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { BadRequestError } from '$/common/error';
import { TransactionRepository, WalletRepository } from '$/db/repositories';
import { TransactionService } from '$/transaction/transaction.service';

import {
  createTransactionRequestMockCredit,
  createTransactionRequestMockDebit,
  transactionMockPayedAlice,
  transactionMockPaymentFromBob,
  userMockJohn,
  walletMockMain,
} from '#/utils/fixtures';
import { transactionMockRepo, walletMockRepo } from '#/utils/mocks/repo.mock';

describe('Transaction Service', () => {
  let module: TestingModule;
  let service: TransactionService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionRepository,
          useValue: transactionMockRepo,
        },
        {
          provide: WalletRepository,
          useValue: walletMockRepo,
        },
        TransactionService,
      ],
    }).compile();
    service = module.get<TransactionService>(TransactionService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    test('should allow a user to create a new credit transaction', async () => {
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMockMain);
      transactionMockRepo.create.mockResolvedValueOnce(transactionMockPaymentFromBob);
      const processedTransaction = {
        ...transactionMockPaymentFromBob,
        state: TransactionState.Processed,
      };
      transactionMockRepo.process.mockResolvedValueOnce(processedTransaction);
      const result = await service.create(userMockJohn.uuid, createTransactionRequestMockCredit);
      expect(result).toMatchObject(processedTransaction);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMockMain.uuid,
      });
      expect(transactionMockRepo.create).toHaveBeenCalledWith({
        ...createTransactionRequestMockCredit,
        state: TransactionState.Pending,
        walletUuid: createTransactionRequestMockCredit.walletId,
      });
      const balance = walletMockMain.balance + transactionMockPaymentFromBob.amount;
      expect(transactionMockRepo.updateState).not.toHaveBeenCalled();
      expect(transactionMockRepo.process).toHaveBeenCalledWith({
        balance,
        transactionUuid: transactionMockPaymentFromBob.uuid,
        walletUuid: walletMockMain.uuid,
      });
    });

    test('should allow a user to create a new debit transaction', async () => {
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMockMain);
      transactionMockRepo.create.mockResolvedValueOnce(transactionMockPayedAlice);
      const processedTransaction = {
        ...transactionMockPayedAlice,
        state: TransactionState.Processed,
      };
      transactionMockRepo.process.mockResolvedValueOnce(processedTransaction);
      const result = await service.create(userMockJohn.uuid, createTransactionRequestMockDebit);
      expect(result).toMatchObject(processedTransaction);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMockMain.uuid,
      });
      expect(transactionMockRepo.create).toHaveBeenCalledWith({
        ...createTransactionRequestMockDebit,
        state: TransactionState.Pending,
        walletUuid: createTransactionRequestMockDebit.walletId,
      });
      const balance = walletMockMain.balance - transactionMockPayedAlice.amount;
      expect(transactionMockRepo.updateState).not.toHaveBeenCalled();
      expect(transactionMockRepo.process).toHaveBeenCalledWith({
        balance,
        transactionUuid: transactionMockPayedAlice.uuid,
        walletUuid: walletMockMain.uuid,
      });
    });

    test('throws if the user has insufficient funds in their wallet', async () => {
      const walletMock: Api.Entities.Wallet = {
        ...walletMockMain,
        balance: 1,
      };
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMock);
      transactionMockRepo.create.mockResolvedValueOnce(transactionMockPayedAlice);
      await expect(
        service.create(userMockJohn.uuid, createTransactionRequestMockDebit),
      ).rejects.toThrowError(BadRequestError);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMock.uuid,
      });
      expect(transactionMockRepo.create).toHaveBeenCalledWith({
        ...createTransactionRequestMockDebit,
        state: TransactionState.Pending,
        walletUuid: createTransactionRequestMockDebit.walletId,
      });
      expect(transactionMockRepo.updateState).toHaveBeenCalledWith({
        state: TransactionState.Rejected,
        transactionUuid: transactionMockPayedAlice.uuid,
      });
      expect(transactionMockRepo.process).not.toHaveBeenCalled();
    });
  });

  describe('getById', () => {
    test('should allow a user to retrieve a specific transaction', async () => {
      transactionMockRepo.findByTransactionAndUserUuidOrFail?.mockResolvedValueOnce(
        transactionMockPaymentFromBob,
      );
      const result = await service.getById(userMockJohn.uuid, transactionMockPaymentFromBob.uuid);
      expect(result).toMatchObject(transactionMockPaymentFromBob);
      expect(transactionMockRepo.findByTransactionAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        transactionUuid: transactionMockPaymentFromBob.uuid,
      });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
/* eslint-enable @typescript-eslint/unbound-method */
