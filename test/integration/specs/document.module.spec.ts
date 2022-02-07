import { default as request } from 'supertest';

import { HttpStatus } from '@nestjs/common';

import { ConfigService } from '$/common/config/config.service';
import { API_GLOBAL_PREFIX } from '$/common/constants';
import { UploadDocumentRequest } from '$/common/dto';
import { Document } from '$/db/entities/document.entity';
import { transactionFixtures } from '$/db/fixtures/transaction.fixture';

import { TestRunner } from '#/integration/test-runner';
import { jwtResponseMock } from '#/utils/fixtures';

describe('Document Module', () => {
  let runner: TestRunner;

  const baseUrl = API_GLOBAL_PREFIX;
  const transaction = transactionFixtures[0] as Api.Entities.Transaction;

  beforeAll(async () => {
    runner = await TestRunner.create({ schema: 'integration_document' });
  });

  afterAll(async () => {
    await runner.close();
  });

  describe(`POST ${baseUrl}/documents`, () => {
    let configService: ConfigService;

    const filePath = require.resolve(`../../utils/files/invoice.pdf`);

    afterEach(() => {
      configService = runner.application.get<ConfigService>(ConfigService);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      configService.awsS3BucketName = 'dellingr';
    });

    test('[201] => should allow a user to upload a new document', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const uploadDocumentRequest: UploadDocumentRequest = {
        name: 'First integration test document',
        transactionId: transaction.uuid,
      };
      await request(runner.application.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .attach('file', filePath)
        .field('name', uploadDocumentRequest.name)
        .field('transactionId', uploadDocumentRequest.transactionId)
        .expect(HttpStatus.CREATED);
      const databaseDocument = await runner.connection.manager.findOne(Document, {
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
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .send({});
      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);
    });

    test('[401] => should throw an unauthorized error if a valid jwt is not provided', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      const res = await request(runner.application.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwtResponseMock.token}`);
      expect(res.status).toEqual(HttpStatus.UNAUTHORIZED);
    });

    test('[424] => should throw a failed dependency error if the AWS S3 upload fails', async () => {
      const jwt = await runner.getJwt();
      expect(jwt.token).toBeDefined();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      configService.awsS3BucketName = 'this-bucket-does-not-exist';
      const uploadDocumentRequest: UploadDocumentRequest = {
        name: 'Second integration test document',
        transactionId: transaction.uuid,
      };
      await request(runner.application.getHttpServer())
        .post(`${baseUrl}/documents`)
        .set('Authorization', `Bearer ${jwt.token}`)
        .attach('file', filePath)
        .field('name', uploadDocumentRequest.name)
        .field('transactionId', uploadDocumentRequest.transactionId)
        .expect(HttpStatus.FAILED_DEPENDENCY);
      const databaseDocument = await runner.connection.manager.findOne(Document, {
        relations: ['transaction'],
        where: {
          name: uploadDocumentRequest.name,
        },
      });
      expect(databaseDocument).not.toBeDefined();
    });
  });
});
