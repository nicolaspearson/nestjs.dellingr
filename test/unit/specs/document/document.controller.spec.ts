import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '$/common/config/config.service';
import { DocumentController } from '$/document/document.controller';
import { DocumentService } from '$/document/document.service';

import { configService } from '#/utils/config';
import {
  authenticatedRequestMock,
  multerFileMock,
  uploadDocumentRequestMock,
} from '#/utils/fixtures';
import { documentMockService } from '#/utils/mocks/service.mock';

describe('Document Controller', () => {
  let module: TestingModule;
  let controller: DocumentController;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [DocumentController],
      providers: [
        { provide: ConfigService, useValue: configService },
        { provide: DocumentService, useValue: documentMockService },
      ],
    }).compile();

    controller = module.get<DocumentController>(DocumentController);
  });

  beforeEach(jest.clearAllMocks);

  test('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('upload', () => {
    test('should allow a user to upload', async () => {
      await controller.upload(authenticatedRequestMock, uploadDocumentRequestMock, multerFileMock);
      expect(documentMockService.upload).toHaveBeenCalledWith(
        authenticatedRequestMock.userUuid,
        uploadDocumentRequestMock,
        multerFileMock.buffer,
      );
    });
  });

  afterAll(async () => {
    await module.close();
  });
});
