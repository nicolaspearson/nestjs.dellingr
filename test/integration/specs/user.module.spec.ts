import { default as request } from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';
import { UserProfileResponse, UserRegistrationRequest } from '$/common/dto';
import { User } from '$/db/entities/user.entity';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

import { jwtResponseMock } from '#/utils/fixtures';
import { getJwt } from '#/utils/integration/auth.util';
import { TestRunner, createTestRunner } from '#/utils/integration/setup-application';

describe('User Module', () => {
  let runner: TestRunner;

  const baseUrl = API_GLOBAL_PREFIX;
  const user = userFixtures[0] as Api.Entities.User;

  beforeAll(async () => {
    runner = await createTestRunner({ schema: 'integration_user' });
  });

  afterAll(async () => {
    await runner.close();
  });

  describe(`DELETE ${baseUrl}/user`, () => {
    test('[204] => should allow a user to delete their account', async () => {
      const deletableUser = userFixtures[2] as Api.Entities.User;
      const jwt = await getJwt(runner.application, {
        email: deletableUser.email,
        password: DEFAULT_PASSWORD,
      });
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .delete(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.NO_CONTENT);
      expect(res.body).toMatchObject({});
      // The user should no longer be able to retrieve their profile after deletion
      await request(runner.application.getHttpServer())
        .get(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.NOT_FOUND);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      const res = await request(runner.application.getHttpServer())
        .delete(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });
  });

  describe(`GET ${baseUrl}/user`, () => {
    test('[200] => should allow a user to retrieve their profile', async () => {
      const jwt = await getJwt(runner.application, {
        email: user.email,
        password: DEFAULT_PASSWORD,
      });
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .get(`${baseUrl}/user`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .expect(HttpStatus.OK);
      const databaseUser = await runner.connection.manager.findOne(User, user.uuid, {
        relations: ['wallets', 'wallets.transactions'],
      });
      expect(databaseUser).toBeDefined();
      expect(res.body).toMatchObject(new UserProfileResponse(databaseUser!));
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      const res = await request(runner.application.getHttpServer())
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
      const res = await request(runner.application.getHttpServer())
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
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/users/registration`)
        .send(existingUserRegistrationRequest)
        .expect(HttpStatus.CREATED);
      expect(res.body).toMatchObject({});
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/users/registration`)
        .send({ email: 'invalid' } as UserRegistrationRequest);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });
  });
});
