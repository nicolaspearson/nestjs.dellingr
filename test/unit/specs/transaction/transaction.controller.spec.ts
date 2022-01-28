import { Test, TestingModule } from '@nestjs/testing';

import { TransactionController } from '$/transaction/transaction.controller';
import { TransactionService } from '$/transaction/transaction.service';

import {
  authenticatedRequestMock,
  createTransactionRequestMockDebit,
  transactionMockPayedAlice,
  transactionResponseMock,
} from '#/utils/fixtures';
import { transactionMockService } from '#/utils/mocks/service.mock';

describe('Transaction Controller', () => {
  let module: TestingModule;
  let controller: TransactionController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [{ provide: TransactionService, useValue: transactionMockService }],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    test('should allow a user to create a new transaction', async () => {
      const result = await controller.create(
        authenticatedRequestMock,
        createTransactionRequestMockDebit,
      );
      expect(result).toMatchObject(transactionResponseMock);
      expect(transactionMockService.create).toHaveBeenCalledWith(
        authenticatedRequestMock.userUuid,
        createTransactionRequestMockDebit,
      );
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
