import { Test, TestingModule } from '@nestjs/testing';

import { TransactionState } from '$/common/enum/transaction-state.enum';
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
      const processedTransaction = {
        ...transactionMockPaymentFromBob,
        state: TransactionState.Processed,
      };
      transactionMockRepo.create.mockResolvedValueOnce(processedTransaction);
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMockMain);
      const result = await service.create(userMockJohn.uuid, createTransactionRequestMockCredit);
      expect(result).toMatchObject(processedTransaction);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMockMain.uuid,
      });
      const balance = walletMockMain.balance + transactionMockPaymentFromBob.amount;
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

    test('should allow a user to create a new debit transaction', async () => {
      const processedTransaction = {
        ...transactionMockPayedAlice,
        state: TransactionState.Processed,
      };
      transactionMockRepo.create.mockResolvedValueOnce(processedTransaction);
      walletMockRepo.findByWalletAndUserUuidOrFail.mockResolvedValueOnce(walletMockMain);
      const result = await service.create(userMockJohn.uuid, createTransactionRequestMockDebit);
      expect(result).toMatchObject(processedTransaction);
      expect(walletMockRepo.findByWalletAndUserUuidOrFail).toHaveBeenCalledWith({
        userUuid: userMockJohn.uuid,
        walletUuid: walletMockMain.uuid,
      });
      const balance = walletMockMain.balance - transactionMockPayedAlice.amount;
      expect(transactionMockRepo.create).toHaveBeenCalledWith({
        amount: createTransactionRequestMockDebit.amount,
        reference: createTransactionRequestMockDebit.reference,
        state: TransactionState.Processed,
        type: createTransactionRequestMockDebit.type,
        walletUuid: createTransactionRequestMockDebit.walletId,
      });
      expect(walletMockRepo.updateBalance).toHaveBeenCalledWith({
        balance,
        walletUuid: walletMockMain.uuid,
      });
    });

    test('should reject the transaction if the user has insufficient funds in their wallet', async () => {
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
      const result = await service.create(userMockJohn.uuid, createTransactionRequestMockDebit);
      expect(result).toMatchObject(rejectedTransaction);
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
    });
  });

  describe('getById', () => {
    test('should allow a user to retrieve a specific transaction', async () => {
      transactionMockRepo.findByTransactionAndUserUuidOrFail.mockResolvedValueOnce(
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
