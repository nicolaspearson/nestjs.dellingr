/* eslint-disable @typescript-eslint/naming-convention */
import { default as request } from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';

import { TestRunner } from '#/integration/test-runner';
import { healthCheckResponseMock } from '#/utils/fixtures';

describe('Health Module', () => {
  let runner: TestRunner;

  const baseUrl = `${API_GLOBAL_PREFIX}/health`;

  beforeAll(async () => {
    runner = await TestRunner.getInstance();
  });

  describe(`GET ${baseUrl}`, () => {
    test('[200] => should return the health status correctly', async () => {
      const res = await request(runner.application.getHttpServer())
        .get(baseUrl)
        .expect(HttpStatus.OK);
      expect(res.body).toMatchObject(healthCheckResponseMock);
      // Should set headers correctly
      expect(res.header).toMatchObject({
        'access-control-allow-credentials': 'true',
        connection: 'close',
        'content-length': expect.any(String),
        'content-security-policy':
          "default-src 'self';base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
        'content-type': 'application/json; charset=utf-8',
        date: expect.any(String),
        etag: expect.any(String),
        'expect-ct': 'max-age=0',
        'referrer-policy': 'no-referrer',
        'strict-transport-security': 'max-age=15552000; includeSubDomains',
        vary: 'Origin',
        'x-content-type-options': 'nosniff',
        'x-dns-prefetch-control': 'off',
        'x-download-options': 'noopen',
        'x-frame-options': 'SAMEORIGIN',
        'x-permitted-cross-domain-policies': 'none',
        'x-xss-protection': '0',
      });
    });
  });
});
/* eslint-enable @typescript-eslint/naming-convention */
