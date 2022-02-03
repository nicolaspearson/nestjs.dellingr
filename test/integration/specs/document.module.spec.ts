import { default as request } from 'supertest';
import { Connection } from 'typeorm';

import { HttpStatus, INestApplication } from '@nestjs/common';

import { API_GLOBAL_PREFIX } from '$/common/constants';
import { JwtResponse, UploadDocumentRequest } from '$/common/dto';
import Document from '$/db/entities/document.entity';
import { transactionFixtures } from '$/db/fixtures/transaction.fixture';
import { DEFAULT_PASSWORD, userFixtures } from '$/db/fixtures/user.fixture';

import { jwtResponseMock } from '#/utils/fixtures';
import { getJwt } from '#/utils/integration/auth.util';
import { setupApplication } from '#/utils/integration/setup-application';

describe('Document Module', () => {
  let app: INestApplication;
  let connection: Connection;
  let jwt: JwtResponse;

  const baseUrl = API_GLOBAL_PREFIX;
  const transaction = transactionFixtures[0] as Api.Entities.Transaction;
  const user = userFixtures[0] as Api.Entities.User;

  beforeEach(jest.clearAllMocks);

  beforeAll(async () => {
    const instance = await setupApplication({ dbSchema: 'integration_document', seedS3: true });
    app = instance.application;
    connection = instance.connection;
    await connection.connect();
    jwt = await getJwt(app, {
      email: user.email,
      password: DEFAULT_PASSWORD,
    });
  });

  describe(`POST ${baseUrl}/documents`, () => {
    const filePath = require.resolve(`../../utils/files/invoice.pdf`);

    beforeEach(() => {
      process.env.AWS_S3_BUCKET_NAME = 'dellingr';
    });

    test('[201] => should allow a user to upload a new document', async () => {
      expect(jwt.token).toBeDefined();
      const uploadDocumentRequest: UploadDocumentRequest = {
        name: 'First integration test document',
        transactionId: transaction.uuid,
      };
      await request(app.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .attach('file', filePath)
        .field('name', uploadDocumentRequest.name)
        .field('transactionId', uploadDocumentRequest.transactionId)
        .expect(HttpStatus.CREATED);
      const databaseDocument = await connection.manager.findOne(Document, {
        relations: ['transaction'],
        where: {
          name: uploadDocumentRequest.name,
        },
      });
      expect(databaseDocument).toMatchObject({
        createdAt: expect.any(Date),
        key: expect.stringContaining(
          `-${uploadDocumentRequest.name.toLowerCase().split(' ').join('-')}`,
        ),
        name: uploadDocumentRequest.name,
        transaction: {
          uuid: uploadDocumentRequest.transactionId,
        },
        updatedAt: expect.any(Date),
        uuid: expect.any(String),
      });
    });

    test('[400] => should throw a bad request error if validation fails', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send({});
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      expect(jwt.token).toBeDefined();
      const res = await request(app.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[424] => should throw a failed dependency error if the AWS S3 upload fails', async () => {
      expect(jwt.token).toBeDefined();
      process.env.AWS_S3_BUCKET_NAME = 'this-bucket-does-not-exist';
      const uploadDocumentRequest: UploadDocumentRequest = {
        name: 'Second integration test document',
        transactionId: transaction.uuid,
      };
      await request(app.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .attach('file', filePath)
        .field('name', uploadDocumentRequest.name)
        .field('transactionId', uploadDocumentRequest.transactionId)
        .expect(HttpStatus.FAILED_DEPENDENCY);
      const databaseDocument = await connection.manager.findOne(Document, {
        relations: ['transaction'],
        where: {
          name: uploadDocumentRequest.name,
        },
      });
      expect(databaseDocument).not.toBeDefined();
    });
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });
});
