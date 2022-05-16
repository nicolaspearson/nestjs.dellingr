import {
  CreateBucketCommand,
  CreateBucketCommandOutput,
  ListBucketsCommand,
  ListBucketsCommandOutput,
} from '@aws-sdk/client-s3';

import { Injectable, Logger } from '@nestjs/common';

import { AwsS3Service } from '$/aws/s3/aws-s3.service';
import { ConfigService } from '$/common/config/config.service';

@Injectable()
export class AwsS3SeederService {
  private readonly logger: Logger = new Logger(AwsS3SeederService.name);

  constructor(
    private readonly awsS3Service: AwsS3Service,
    private readonly configService: ConfigService,
  ) {
    this.logger.debug('AWS S3 seeder service created!');
  }

  private createBucket(bucketName: string): Promise<CreateBucketCommandOutput> {
    this.logger.debug(`Creating AWS S3 bucket: "${bucketName}"`);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return this.awsS3Service.send(new CreateBucketCommand({ Bucket: bucketName }));
  }

  private getBuckets(): Promise<ListBucketsCommandOutput> {
    return this.awsS3Service.send(new ListBucketsCommand({}));
  }

  async seed(): Promise<void> {
    this.logger.debug('Seeding AWS S3');
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const bucketName = this.configService.aws.s3BucketName;

      // Check if the bucket already exists
      const buckets = await this.getBuckets();
      const bucketExists = buckets.Buckets?.some((b) => b.Name === bucketName);

      // Create the bucket if it does not exist (this check is required for HMR).
      if (!bucketExists) {
        await this.createBucket(bucketName);
      } else {
        this.logger.debug(`AWS S3 already seeded, skipped.`);
      }
    } catch (error) {
      throw error;
    }
  }
}
