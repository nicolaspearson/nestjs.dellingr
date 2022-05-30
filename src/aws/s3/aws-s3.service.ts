/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client, ServiceOutputTypes } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

import { ConfigService } from '$/common/config/config.service';

@Injectable()
export class AwsS3Service extends S3Client implements OnModuleDestroy {
  private readonly logger: Logger = new Logger(AwsS3Service.name);

  constructor(protected readonly configService: ConfigService) {
    super({
      credentials: {
        accessKeyId: configService.aws.accessKeyId,
        secretAccessKey: configService.aws.secretAccessKey,
      },
      endpoint: configService.aws.endpoint,
      forcePathStyle: true,
      region: configService.aws.region,
    });
    this.logger.debug('AWS S3 service created!');
  }

  onModuleDestroy(): void {
    this.destroy();
  }

  async upload(data: { bucket: string; key: string; body: Buffer }): Promise<ServiceOutputTypes> {
    const s3Upload = new Upload({
      client: this,
      params: {
        Body: data.body,
        Bucket: data.bucket,
        Key: data.key,
      },
    });
    s3Upload.on('httpUploadProgress', (progress) => {
      this.logger.log(`AWS S3 upload progress: ${JSON.stringify(progress)}`);
    });
    return s3Upload.done();
  }
}
/* eslint-enable @typescript-eslint/naming-convention */
