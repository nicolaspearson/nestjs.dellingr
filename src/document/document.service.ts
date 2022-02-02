import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UploadDocumentRequest } from '$/common/dto';
import { FailedDependencyError } from '$/common/error';
import { DocumentRepository, TransactionRepository } from '$/db/repositories';

@Injectable()
export class DocumentService {
  private readonly logger: Logger = new Logger(DocumentService.name);
  private readonly s3: S3;

  constructor(
    private readonly configService: ConfigService,
    private readonly documentRepository: DocumentRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {
    this.logger.debug('Document service created!');
    this.s3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      region: this.configService.get<string>('AWS_REGION'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  /**
   * Uploads a new document to AWS S3 and links it to the specified transaction.
   *
   * @param userUuid The uuid of the user.
   * @param dto The {@link UploadDocumentRequest} object.
   * @param buffer The file upload {@link Buffer}.
   *
   * @throws {@link NotFoundError} If the transaction does not exist.
   * @throws {@link FailedDependencyError} If the AWS S3 upload failed.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async upload(userUuid: Uuid, dto: UploadDocumentRequest, buffer: Buffer): Promise<void> {
    // Check if the transaction exists for the specified user.
    const transaction = await this.transactionRepository.findByTransactionAndUserUuidOrFail({
      transactionUuid: dto.transactionId,
      userUuid,
    });
    const documentUuid = uuid() as Uuid;
    this.logger.log(`Uploading new document: "${dto.name}" for user with uuid: ${userUuid}`);
    let result: S3.ManagedUpload.SendData;
    try {
      result = await this.s3
        .upload(
          /* eslint-disable @typescript-eslint/naming-convention */ {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            Bucket: this.configService.get('AWS_S3_BUCKET_NAME')!,
            Body: buffer,
            Key: `${documentUuid}-${dto.name.toLowerCase().split(' ').join('-')}.pdf`,
          },
          /* eslint-enable @typescript-eslint/naming-convention */
        )
        .promise();
    } catch (error: unknown) {
      this.logger.error(`AWS S3 file upload failed for user with uuid: ${userUuid}`, error);
      const s3Error = error as S3.Error;
      throw new FailedDependencyError(s3Error.Message);
    }
    this.logger.log(
      `Document successfully upload to S3: "${result.Location}" for user with uuid: ${userUuid}`,
    );
    await this.documentRepository.create({
      name: dto.name,
      transactionUuid: transaction.uuid,
      url: result.Location,
      uuid: documentUuid,
    });
  }
}
