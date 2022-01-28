import { default as request } from 'supertest';
import { Connection } from 'typeorm';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';
import { CreateTransactionRequest, JwtResponse, TransactionResponse } from '$/common/dto';
import { TransactionState } from '$/common/enum/transaction-state.enum';
import Transaction from '$/db/entities/transaction.entity';
import { transactionFixtures } from '$/db/fixtures/transaction.fixture';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

import {
  createTransactionRequestMockCredit,
  createTransactionRequestMockDebit,
  jwtResponseMock,
  transactionMockPayedAlice,
} from '#/utils/fixtures';
import { getJwt } from '#/utils/integration/auth.util';
import { setupApplication } from '#/utils/integration/setup-application';

describe('Transaction Module', () => {
  let app: INestApplication;
  let connection: Connection;
  let jwt: JwtResponse;

  const baseUrl = API_GLOBAL_PREFIX;
  const transaction = transactionFixtures[0] as Api.Entities.Transaction;
  const user = userFixtures[0] as Api.Entities.User;

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    const instance = await setupApplication({ dbSchema: 'integration_transaction' });
    app = instance.application;
    connection = instance.connection;
    await connection.connect();
    jwt = await getJwt(app, {
      email: user.email,
      password: DEFAULT_PASSWORD,
    });
  });

  describe(`POST ${baseUrl}/transactions`, () => {
    test('[201] => should allow a user to create a new credit transaction', async () => {
      expect(jwt.token).toBeDefined();
      const createTransactionRequest: CreateTransactionRequest = {
        ...createTransactionRequestMockCredit,
        reference: 'Integration test #1 credit transaction!',
        walletId: transaction.wallet.uuid,
      };
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send(createTransactionRequest)
        .expect(HttpStatus.CREATED);
      const databaseTransaction = await connection.manager.findOne(Transaction, {
        where: {
          reference: createTransactionRequest.reference,
        },
      });
      expect(databaseTransaction).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(res.body).toMatchObject(new TransactionResponse(databaseTransaction!));
    });

    test('[201] => should allow a user to create a new debit transaction', async () => {
      expect(jwt.token).toBeDefined();
      const createTransactionRequest: CreateTransactionRequest = {
        ...createTransactionRequestMockDebit,
        reference: '#Integration test #2 debit transaction!',
        walletId: transaction.wallet.uuid,
      };
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send(createTransactionRequest)
        .expect(HttpStatus.CREATED);
      const databaseTransaction = await connection.manager.findOne(Transaction, {
        where: {
          reference: createTransactionRequest.reference,
        },
      });
      expect(databaseTransaction).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(res.body).toMatchObject(new TransactionResponse(databaseTransaction!));
    });

    test('[400] => should throw a bad request error if there are insufficient funds in the wallet', async () => {
      expect(jwt.token).toBeDefined();
      const createTransactionRequest: CreateTransactionRequest = {
        ...createTransactionRequestMockDebit,
        amount: 100_000,
        reference: 'Integration test #3 insufficient funds!',
        walletId: transaction.wallet.uuid,
      };
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send(createTransactionRequest);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
      const databaseTransaction = await connection.manager.findOne(Transaction, {
        where: {
          reference: createTransactionRequest.reference,
        },
      });
      expect(databaseTransaction).toBeDefined();
      expect(databaseTransaction?.state).toEqual(TransactionState.Rejected);
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send({});
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/transactions`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`GET ${baseUrl}/transaction/:id`, () => {
    test('[200] => should allow a user to retrieve a transaction', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/transaction/${transaction.uuid}`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.OK);
      const databaseTransaction = await connection.manager.findOne(Transaction, transaction.uuid);
      expect(databaseTransaction).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(res.body).toMatchObject(new TransactionResponse(databaseTransaction!));
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/transaction/12345`)
        .set('Authorization', `Bearer ${jwt.token}`);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/transaction/${transaction.uuid}`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[404] => should throw a not found error if the transaction does not exist', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/transaction/${transactionMockPayedAlice.uuid}`)
        .set('Authorization', `Bearer ${jwt.token}`);
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
