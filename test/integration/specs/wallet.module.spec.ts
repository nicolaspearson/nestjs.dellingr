import { default as request } from 'supertest';
import { Connection } from 'typeorm';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { API_GLOBAL_PREFIX, DEFAULT_WALLET_BALANCE } from '$/common/constants';
import { CreateWalletRequest, JwtResponse, WalletResponse } from '$/common/dto';
import { Wallet } from '$/db/entities/wallet.entity';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';
import { walletFixtures } from '$/db/fixtures/wallet.fixture';

import { jwtResponseMock, walletMockSecondary } from '#/utils/fixtures';
import { getJwt } from '#/utils/integration/auth.util';
import { setupApplication } from '#/utils/integration/setup-application';

describe('Wallet Module', () => {
  let app: INestApplication;
  let connection: Connection;
  let jwt: JwtResponse;

  const baseUrl = API_GLOBAL_PREFIX;
  const user = userFixtures[0] as Api.Entities.User;
  const wallet = walletFixtures[0] as Api.Entities.Wallet;

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    const instance = await setupApplication({ dbSchema: 'integration_wallet' });
    app = instance.application;
    connection = instance.connection;
    await connection.connect();
    jwt = await getJwt(app, {
      email: user.email,
      password: DEFAULT_PASSWORD,
    });
  });

  describe(`POST ${baseUrl}/wallets`, () => {
    test('[201] => should allow a user to create a new wallet', async () => {
      expect(jwt.token).toBeDefined();
      const createWalletRequest: CreateWalletRequest = {
        name: 'An integration test wallet',
      };
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/wallets`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send(createWalletRequest)
        .expect(HttpStatus.CREATED);
      const databaseWallet = await connection.manager.findOne(Wallet, {
        where: {
          name: createWalletRequest.name,
        },
      });
      expect(databaseWallet).toBeDefined();
      expect(res.body).toMatchObject({
        id: databaseWallet?.uuid,
        balance: DEFAULT_WALLET_BALANCE,
        name: createWalletRequest.name,
        transactions: [],
      } as WalletResponse);
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/wallets`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send({});
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/wallets`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`GET ${baseUrl}/wallet/:id`, () => {
    test('[200] => should allow a user to retrieve their wallet', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/wallet/${wallet.uuid}`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.OK);
      const databaseWallet = await connection.manager.findOne(Wallet, wallet.uuid, {
        relations: ['transactions'],
      });
      expect(databaseWallet).toBeDefined();
      expect(res.body).toMatchObject(new WalletResponse(databaseWallet!));
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/wallet/12345`)
        .set('Authorization', `Bearer ${jwt.token}`);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/wallet/${wallet.uuid}`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[404] => should throw a not found error if the wallet does not exist', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/wallet/${walletMockSecondary.uuid}`)
        .set('Authorization', `Bearer ${jwt.token}`);
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
