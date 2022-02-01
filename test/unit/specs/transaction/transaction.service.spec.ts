/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { BadRequestError } from '$/common/error';
import { TransactionRepository, WalletRepository } from '$/db/repositories';
import { UnitOfWorkService } from '$/db/services';
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
import { unitOfWorkMockService } from '#/utils/mocks/service.mock';

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
          provide: UnitOfWorkService,
          useValue: unitOfWorkMockService,
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
      const processedTransaction = {
        ...transactionMockPaymentFromBob,
        state: TransactionState.Processed,
      };
      unitOfWorkMockService.doTransactional.mockResolvedValueOnce(processedTransaction);
      const result = await service.create(userMockJohn.uuid, createTransactionRequestMockCredit);
      expect(result).toMatchObject(processedTransaction);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMockMain.uuid,
      });
      expect(transactionMockRepo.create).not.toHaveBeenCalled();
      const balance = walletMockMain.balance + transactionMockPaymentFromBob.amount;
      // This assertion is pointless, and is a placeholder for asserting that
      // the anonymous inner function is called with the correct arguments.
      expect(balance).toEqual(10_150);
      expect(unitOfWorkMockService.doTransactional).toHaveBeenCalledTimes(1);
    });

    test('should allow a user to create a new debit transaction', async () => {
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMockMain);
      const processedTransaction = {
        ...transactionMockPayedAlice,
        state: TransactionState.Processed,
      };
      unitOfWorkMockService.doTransactional.mockResolvedValueOnce(processedTransaction);
      const result = await service.create(userMockJohn.uuid, createTransactionRequestMockDebit);
      expect(result).toMatchObject(processedTransaction);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMockMain.uuid,
      });
      expect(transactionMockRepo.create).not.toHaveBeenCalled();
      const balance = walletMockMain.balance - transactionMockPayedAlice.amount;
      // This assertion is pointless, and is a placeholder for asserting that
      // the anonymous inner function is called with the correct arguments.
      expect(balance).toEqual(9950);
      expect(unitOfWorkMockService.doTransactional).toHaveBeenCalledTimes(1);
    });

    test('throws if the user has insufficient funds in their wallet', async () => {
      const walletMock: Api.Entities.Wallet = {
        ...walletMockMain,
        balance: 1,
      };
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMock);
      const rejectedTransaction = {
        ...transactionMockPayedAlice,
        state: TransactionState.Rejected,
      };
      transactionMockRepo.create.mockResolvedValueOnce(rejectedTransaction);
      await expect(
        service.create(userMockJohn.uuid, createTransactionRequestMockDebit),
      ).rejects.toThrowError(BadRequestError);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMock.uuid,
      });
      expect(transactionMockRepo.create).toHaveBeenCalledWith({
        amount: createTransactionRequestMockDebit.amount,
        reference: createTransactionRequestMockDebit.reference,
        state: TransactionState.Rejected,
        type: createTransactionRequestMockDebit.type,
        walletUuid: createTransactionRequestMockDebit.walletId,
      });
      expect(unitOfWorkMockService.doTransactional).not.toHaveBeenCalled();
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

  describe('processTransaction', () => {
    test('should process a transaction correctly', async () => {
      const processedTransaction = {
        ...transactionMockPaymentFromBob,
        state: TransactionState.Processed,
      };
      transactionMockRepo.create.mockResolvedValueOnce(processedTransaction);
      const balance = walletMockMain.balance + transactionMockPaymentFromBob.amount;
      const result = await service['processTransaction']({
        ...createTransactionRequestMockCredit,
        balance,
      });
      expect(result).toMatchObject(processedTransaction);
      expect(transactionMockRepo.create).toHaveBeenCalledWith({
        amount: createTransactionRequestMockCredit.amount,
        reference: createTransactionRequestMockCredit.reference,
        state: TransactionState.Processed,
        type: createTransactionRequestMockCredit.type,
        walletUuid: createTransactionRequestMockCredit.walletId,
      });
      expect(walletMockRepo.updateBalance).toHaveBeenCalledWith({
        balance,
        walletUuid: walletMockMain.uuid,
      });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
/* eslint-enable @typescript-eslint/unbound-method */
