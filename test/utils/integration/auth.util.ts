import { default as request } from 'supertest';

import { INestApplication } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';
import { JwtResponse, LoginRequest } from '$/common/dto';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

export async function getJwt(app: INestApplication, data?: LoginRequest): Promise<JwtResponse> {
  const res = await request(app.getHttpServer())
    .post(`${API_GLOBAL_PREFIX}/auth/login`)
    .send({
      email: data?.email ?? userFixtures[0].email,
      password: data?.password ?? DEFAULT_PASSWORD,
    } as LoginRequest);
  return res.body as JwtResponse;
}
