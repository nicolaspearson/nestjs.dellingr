import { v4 as uuid } from 'uuid';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AwsS3Service } from '$/aws/s3/aws-s3.service';
import { UploadDocumentRequest } from '$/common/dto';
import { FailedDependencyError } from '$/common/error';
import { DocumentRepository, TransactionRepository } from '$/db/repositories';

@Injectable()
export class DocumentService {
  private readonly logger: Logger = new Logger(DocumentService.name);

  private readonly bucketName: string;

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService,
    private readonly documentRepository: DocumentRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {
    this.logger.debug('Document service created!');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME')!;
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
    const documentKey = `${documentUuid}-${dto.name.toLowerCase().split(' ').join('-')}`;
    this.logger.log(`Uploading new document: "${dto.name}" for user with uuid: ${userUuid}`);
    try {
      await this.awsS3Service.upload({
        body: buffer,
        bucket: this.bucketName,
        key: documentKey,
      });
    } catch (error) {
      this.logger.error(`AWS S3 file upload failed for user with uuid: ${userUuid}`, error);
      throw new FailedDependencyError();
    }
    this.logger.log(
      `Document successfully upload to S3: "${documentKey}" for user with uuid: ${userUuid}`,
    );
    await this.documentRepository.create({
      key: documentKey,
      name: dto.name,
      transactionUuid: transaction.uuid,
      uuid: documentUuid,
    });
  }
}
