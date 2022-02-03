/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client } from '@aws-sdk/client-s3';
import { Progress, Upload } from '@aws-sdk/lib-storage';
import { mockClient, mockLibStorageUpload } from 'aws-sdk-client-mock';

import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from '$/aws/s3/aws-s3.service';

import {
  awsS3DocumentBucketName,
  documentMockInvoice,
  multerFileBufferStringMock,
  multerFileMock,
} from '#/utils/fixtures';

// Reference: https://github.com/m-radzikowski/aws-sdk-client-mock#lib-storage-upload
const s3Mock = mockClient(S3Client);
mockLibStorageUpload(s3Mock);

describe('AWS S3 Service', () => {
  let module: TestingModule;
  let service: AwsS3Service;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AwsS3Service, ConfigService],
    }).compile();
    service = module.get<AwsS3Service>(AwsS3Service);
  });

  beforeEach(() => {
    jest.clearAllMocks();
    s3Mock.reset();
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    const data = {
      body: multerFileMock.buffer,
      bucket: awsS3DocumentBucketName,
      key: `${documentMockInvoice.uuid}-${documentMockInvoice.name}`,
    };

    test('should upload a document correctly', async () => {
      const result = await service.upload(data);
      expect(result).not.toBeDefined();
      expect(s3Mock.calls().length).toEqual(1);
      const uploadCall = s3Mock.call(0);
      expect(uploadCall.args.length).toEqual(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      expect(uploadCall.args[0].input).toMatchObject({
        Body: data.body,
        Bucket: data.bucket,
        Key: data.key,
      });
    });

    test('s3 sdk uploads to correctly', async () => {
      // This tests the underlying sdk which is not very useful, but
      // will is covered end-to-end in the integration tests so the
      // unit tests for this service could also be removed in future.
      const s3Upload = new Upload({
        client: new S3Client({}),
        params: {
          Body: data.body,
          Bucket: data.bucket,
          Key: data.key,
        },
      });
      const uploadProgress: Progress[] = [];
      s3Upload.on('httpUploadProgress', (progress) => {
        uploadProgress.push(progress);
      });
      await s3Upload.done();
      expect(uploadProgress).toHaveLength(1);
      expect(uploadProgress[0]).toStrictEqual({
        Bucket: data.bucket,
        Key: data.key,
        loaded: multerFileBufferStringMock.length,
        total: multerFileBufferStringMock.length,
        part: 1,
      });
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
/* eslint-enable @typescript-eslint/naming-convention */
