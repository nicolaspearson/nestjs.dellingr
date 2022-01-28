import { default as request } from 'supertest';
import { Connection } from 'typeorm';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';
import { UserProfileResponse, UserRegistrationRequest } from '$/common/dto';
import User from '$/db/entities/user.entity';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

import { jwtResponseMock } from '#/utils/fixtures';
import { getJwt } from '#/utils/integration/auth.util';
import { setupApplication } from '#/utils/integration/setup-application';

describe('User Module', () => {
  let app: INestApplication;
  let connection: Connection;

  const baseUrl = API_GLOBAL_PREFIX;
  const user = userFixtures[0] as Api.Entities.User;

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    const instance = await setupApplication({ dbSchema: 'integration_user' });
    app = instance.application;
    connection = instance.connection;
    await connection.connect();
  });

  describe(`DELETE ${baseUrl}/user`, () => {
    test('[204] => should allow a user to delete their account', async () => {
      const deletableUser = userFixtures[2] as Api.Entities.User;
      const jwt = await getJwt(app, {
        email: deletableUser.email,
        password: DEFAULT_PASSWORD,
      });
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .delete(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.NO_CONTENT);
      expect(res.body).toMatchObject({});
      // The user should no longer be able to retrieve their profile after deletion
      await request(app.getHttpServer())
        .get(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      const res = await request(app.getHttpServer())
        .delete(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`GET ${baseUrl}/user`, () => {
    test('[200] => should allow a user to retrieve their profile', async () => {
      const jwt = await getJwt(app, {
        email: user.email,
        password: DEFAULT_PASSWORD,
      });
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.OK);
      const databaseUser = await connection.manager.findOne(User, user.uuid, {
        relations: ['wallets', 'wallets.transactions'],
      });
      expect(databaseUser).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(res.body).toMatchObject(new UserProfileResponse(databaseUser!));
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      const res = await request(app.getHttpServer())
        .get(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`POST ${baseUrl}/users/registration`, () => {
    test('[201] => should allow a user to register', async () => {
      const newUserRegistrationRequest: UserRegistrationRequest = {
        email: 'new-user@example.com' as Email,
        password: DEFAULT_PASSWORD,
      };
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/users/registration`)
        .send(newUserRegistrationRequest)
        .expect(HttpStatus.CREATED);
      expect(res.body).toMatchObject({});
    });

    test('[201] => should not throw an error if the user already exists', async () => {
      const existingUserRegistrationRequest: UserRegistrationRequest = {
        email: user.email,
        password: DEFAULT_PASSWORD,
      };
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/users/registration`)
        .send(existingUserRegistrationRequest)
        .expect(HttpStatus.CREATED);
      expect(res.body).toMatchObject({});
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/users/registration`)
        .send({ email: 'invalid' } as UserRegistrationRequest);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
