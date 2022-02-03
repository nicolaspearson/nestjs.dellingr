import { default as request } from 'supertest';
import { Connection } from 'typeorm';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';
import { JwtResponse, LoginRequest } from '$/common/dto';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

import { setupApplication } from '#/utils/integration/setup-application';

describe('Auth Module', () => {
  let app: INestApplication;
  let connection: Connection;

  const baseUrl = `${API_GLOBAL_PREFIX}/auth`;
  const user = userFixtures[0] as Api.Entities.User;

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    const instance = await setupApplication({ dbSchema: 'integration_auth' });
    app = instance.application;
    connection = instance.connection;
    await connection.connect();
  });

  describe(`POST ${baseUrl}/login`, () => {
    test('[200] => should allow a user to login', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send({
          email: user.email,
          password: DEFAULT_PASSWORD,
        } as LoginRequest)
        .expect(HttpStatus.OK);
      expect(res.body).toMatchObject({
        token: expect.any(String),
      } as JwtResponse);
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send({ email: 'invalid-email' } as LoginRequest);
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test("[404] => should throw a not found error if the user's credentials are invalid", async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send({
          email: user.email,
          password: 'invalid-password',
        } as LoginRequest);
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });

    test('[404] => should throw a not found error if the user does not exist', async () => {
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/login`)
        .send({
          email: 'brand-new-user@example.com',
          password: DEFAULT_PASSWORD,
        } as LoginRequest);
      expect(res.status).toEqual(HttpStatus.NOT_FOUND);
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
