import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { FailedDependencyError } from '$/common/error';
import { AwsS3Service } from '$/common/services/aws-s3.service';
import { DocumentRepository, TransactionRepository } from '$/db/repositories';
import { DocumentService } from '$/document/document.service';

import {
  documentMockInvoice,
  managedUploadMockFactory,
  multerFileMock,
  sendDataMock,
  transactionMockPaymentFromBob,
  uploadDocumentRequestMock,
  userMockJohn,
} from '#/utils/fixtures';
import { documentMockRepo, transactionMockRepo } from '#/utils/mocks/repo.mock';
import { awsS3MockService, s3ClientMock } from '#/utils/mocks/service.mock';

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
        {
          provide: DocumentRepository,
          useValue: documentMockRepo,
        },
        {
          provide: TransactionRepository,
          useValue: transactionMockRepo,
        },
        ConfigService,
        DocumentService,
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
      expect(s3ClientMock.upload).toHaveBeenCalledWith(
        /* eslint-disable @typescript-eslint/naming-convention */
        {
          Bucket: sendDataMock.Bucket,
          Body: multerFileMock.buffer,
          Key: expect.stringContaining(`-${documentMockInvoice.name}.pdf`),
        },
        /* eslint-enable @typescript-eslint/naming-convention */
      );
      expect(documentMockRepo.create).toHaveBeenCalledWith({
        name: uploadDocumentRequestMock.name,
        transactionUuid: transactionMockPaymentFromBob.uuid,
        url: sendDataMock.Location,
        uuid: expect.any(String),
      });
    });

    test('throws if the aws s3 upload fails', async () => {
      transactionMockRepo.findByTransactionAndUserUuidOrFail.mockResolvedValueOnce(
        transactionMockPaymentFromBob,
      );
      const failedManagedUploadMock = managedUploadMockFactory({ sendData: sendDataMock });
      failedManagedUploadMock.promise.mockRejectedValueOnce(new Error('Upload failed.'));
      s3ClientMock.upload.mockReturnValueOnce(failedManagedUploadMock);
      await expect(
        service.upload(userMockJohn.uuid, uploadDocumentRequestMock, multerFileMock.buffer),
      ).rejects.toThrowError(FailedDependencyError);
      expect(transactionMockRepo.findByTransactionAndUserUuidOrFail).toHaveBeenCalledWith({
        transactionUuid: uploadDocumentRequestMock.transactionId,
        userUuid: userMockJohn.uuid,
      });
      expect(s3ClientMock.upload).toHaveBeenCalledWith(
        /* eslint-disable @typescript-eslint/naming-convention */
        {
          Bucket: sendDataMock.Bucket,
          Body: multerFileMock.buffer,
          Key: expect.stringContaining(`-${documentMockInvoice.name}.pdf`),
        },
        /* eslint-enable @typescript-eslint/naming-convention */
      );
      expect(documentMockRepo.create).not.toHaveBeenCalled();
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
