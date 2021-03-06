import { default as request } from 'supertest';
import { FindOptionsWhere } from 'typeorm';

import { HttpStatus } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';
import { CreateTransactionRequest, TransactionResponse } from '$/common/dto';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import { Transaction } from '$/db/entities/transaction.entity';
import { transactionFixtures } from '$/db/fixtures/transaction.fixture';

import { TestRunner } from '#/integration/test-runner';
import {
  createTransactionRequestMockCredit,
  createTransactionRequestMockDebit,
  jwtResponseMock,
  transactionMockPayedAlice,
} from '#/utils/fixtures';

describe('Transaction Module', () => {
  let runner: TestRunner;

  const baseUrl = API_GLOBAL_PREFIX;
  const transaction = transactionFixtures[0] as Api.Entities.Transaction;

  beforeAll(async () => {
    runner = await TestRunner.getInstance();
  });

  describe(`POST ${baseUrl}/transactions`, () => {
    test('[201] => should allow a user to create a new credit transaction', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const createTransactionRequest: CreateTransactionRequest = {
        ...createTransactionRequestMockCredit,
        reference: 'Integration test #1 credit transaction!',
        walletId: transaction.wallet!.uuid,
      };
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send(createTransactionRequest)
        .expect(HttpStatus.CREATED);
      const databaseTransaction = await runner.dataSource.manager.findOne(Transaction, {
        where: {
          reference: createTransactionRequest.reference,
        },
      });
      expect(databaseTransaction).toBeDefined();
      expect(res.body).toMatchObject(new TransactionResponse(databaseTransaction!));
    });

    test('[201] => should allow a user to create a new debit transaction', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const createTransactionRequest: CreateTransactionRequest = {
        ...createTransactionRequestMockDebit,
        reference: '#Integration test #2 debit transaction!',
        walletId: transaction.wallet!.uuid,
      };
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send(createTransactionRequest)
        .expect(HttpStatus.CREATED);
      const databaseTransaction = await runner.dataSource.manager.findOne(Transaction, {
        where: {
          reference: createTransactionRequest.reference,
        },
      });
      expect(databaseTransaction).toBeDefined();
      expect(res.body).toMatchObject(new TransactionResponse(databaseTransaction!));
    });

    test('[400] => should throw a bad request error if there are insufficient funds in the wallet', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const createTransactionRequest: CreateTransactionRequest = {
        ...createTransactionRequestMockDebit,
        amount: 100_000,
        reference: 'Integration test #3 insufficient funds!',
        walletId: transaction.wallet!.uuid,
      };
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send(createTransactionRequest);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
      const databaseTransaction = await runner.dataSource.manager.findOne(Transaction, {
        where: {
          reference: createTransactionRequest.reference,
        },
      });
      expect(databaseTransaction).toBeDefined();
      expect(databaseTransaction?.state).toEqual(TransactionState.Rejected);
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send({});
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`GET ${baseUrl}/transaction/:id`, () => {
    test('[200] => should allow a user to retrieve a transaction', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .get(`${baseUrl}/transaction/${transaction.uuid}`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.OK);
      const databaseTransaction = await runner.dataSource.manager.findOne(Transaction, {
        where: { uuid: transaction.uuid } as unknown as FindOptionsWhere<Transaction>,
      });
      expect(databaseTransaction).toBeDefined();
      expect(res.body).toMatchObject(new TransactionResponse(databaseTransaction!));
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .get(`${baseUrl}/transaction/12345`)
        .set('Authorization', `Bearer ${jwt.token}`);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .get(`${baseUrl}/transaction/${transaction.uuid}`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[404] => should throw a not found error if the transaction does not exist', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .get(`${baseUrl}/transaction/${transactionMockPayedAlice.uuid}`)
        .set('Authorization', `Bearer ${jwt.token}`);
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });
});
