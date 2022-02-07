import { Test, TestingModule } from '@nestjs/testing';

import { AwsS3Service } from '$/aws/s3/aws-s3.service';
import { ConfigService } from '$/common/config/environment.config';
import { FailedDependencyError } from '$/common/error';
import { DocumentRepository, TransactionRepository } from '$/db/repositories';
import { DocumentService } from '$/document/document.service';

import { configService } from '#/utils/config';
import {
  documentMockInvoice,
  multerFileMock,
  transactionMockPaymentFromBob,
  uploadDocumentRequestMock,
  userMockJohn,
} from '#/utils/fixtures';
import { documentMockRepo, transactionMockRepo } from '#/utils/mocks/repo.mock';
import { awsS3MockService } from '#/utils/mocks/service.mock';

describe('Document Service', () => {
  let module: TestingModule;
  let service: DocumentService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: AwsS3Service,
          useValue: awsS3MockService,
        },
        { provide: ConfigService, useValue: configService },
        {
          provide: DocumentRepository,
          useValue: documentMockRepo,
        },
        DocumentService,
        {
          provide: TransactionRepository,
          useValue: transactionMockRepo,
        },
      ],
    }).compile();
    service = module.get<DocumentService>(DocumentService);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('upload', () => {
    test('should allow a user to upload a document', async () => {
      transactionMockRepo.findByTransactionAndUserUuidOrFail.mockResolvedValueOnce(
        transactionMockPaymentFromBob,
      );
      await service.upload(userMockJohn.uuid, uploadDocumentRequestMock, multerFileMock.buffer);
      expect(transactionMockRepo.findByTransactionAndUserUuidOrFail).toHaveBeenCalledWith({
        transactionUuid: uploadDocumentRequestMock.transactionId,
        userUuid: userMockJohn.uuid,
      });
      expect(awsS3MockService.upload).toHaveBeenCalledWith({
        body: multerFileMock.buffer,
        bucket: configService.awsS3BucketName,
        key: expect.stringContaining(`-${documentMockInvoice.name}`),
      });
      expect(documentMockRepo.create).toHaveBeenCalledWith({
        key: expect.stringContaining(`-${documentMockInvoice.name}`),
        name: uploadDocumentRequestMock.name,
        transactionUuid: transactionMockPaymentFromBob.uuid,
        uuid: expect.any(String),
      });
    });

    test('throws if the aws s3 upload fails', async () => {
      transactionMockRepo.findByTransactionAndUserUuidOrFail.mockResolvedValueOnce(
        transactionMockPaymentFromBob,
      );
      awsS3MockService.upload.mockRejectedValueOnce(new Error('Upload failed.'));
      await expect(
        service.upload(userMockJohn.uuid, uploadDocumentRequestMock, multerFileMock.buffer),
      ).rejects.toThrowError(FailedDependencyError);
      expect(transactionMockRepo.findByTransactionAndUserUuidOrFail).toHaveBeenCalledWith({
        transactionUuid: uploadDocumentRequestMock.transactionId,
        userUuid: userMockJohn.uuid,
      });
      expect(awsS3MockService.upload).toHaveBeenCalledWith({
        body: multerFileMock.buffer,
        bucket: configService.awsS3BucketName,
        key: expect.stringContaining(`-${documentMockInvoice.name}`),
      });
      expect(documentMockRepo.create).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
