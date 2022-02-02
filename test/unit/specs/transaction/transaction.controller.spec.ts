import { Test, TestingModule } from '@nestjs/testing';

import { TransactionResponse } from '$/common/dto';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import { BadRequestError } from '$/common/error';
import { DatabaseTransactionService } from '$/db/services/database-transaction.service';
import { TransactionController } from '$/transaction/transaction.controller';
import { TransactionService } from '$/transaction/transaction.service';

import {
  authenticatedRequestMock,
  createTransactionRequestMockCredit,
  createTransactionRequestMockDebit,
  transactionMockPayedAlice,
  transactionMockPaymentFromBob,
  transactionResponseMock,
} from '#/utils/fixtures';
import { databaseTransactionMockService, transactionMockService } from '#/utils/mocks/service.mock';

describe('Transaction Controller', () => {
  let module: TestingModule;
  let controller: TransactionController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        { provide: TransactionService, useValue: transactionMockService },
        {
          provide: DatabaseTransactionService,
          useValue: databaseTransactionMockService,
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('should allow a user to create a new transaction', async () => {
      const processedTransaction = {
        ...transactionMockPaymentFromBob,
        state: TransactionState.Processed,
      };
      databaseTransactionMockService.execute.mockResolvedValueOnce(processedTransaction);
      const result = await controller.create(
        authenticatedRequestMock,
        createTransactionRequestMockCredit,
      );
      expect(result).toMatchObject(new TransactionResponse(processedTransaction));
      expect(databaseTransactionMockService.execute).toHaveBeenCalledTimes(1);
    });

    test('throws if the transaction has been rejected', async () => {
      const rejectedTransaction = {
        ...transactionMockPayedAlice,
        state: TransactionState.Rejected,
      };
      databaseTransactionMockService.execute.mockResolvedValueOnce(rejectedTransaction);
      await expect(
        controller.create(authenticatedRequestMock, createTransactionRequestMockDebit),
      ).rejects.toThrowError(BadRequestError);
      expect(databaseTransactionMockService.execute).toHaveBeenCalledTimes(1);
    });
  });

  describe('getById', () => {
    test('should allow a user to retrieve a transaction by id', async () => {
      const result = await controller.getById(authenticatedRequestMock, {
        id: transactionMockPayedAlice.uuid,
      });
      expect(result).toMatchObject(transactionResponseMock);
      expect(transactionMockService.getById).toHaveBeenCalledWith(
        authenticatedRequestMock.userUuid,
        transactionMockPayedAlice.uuid,
      );
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
