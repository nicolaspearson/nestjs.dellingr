/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client, ServiceOutputTypes } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '$/common/config/config.service';

@Injectable()
export class AwsS3Service extends S3Client {
  private readonly logger: Logger = new Logger(AwsS3Service.name);

  constructor(protected readonly configService: ConfigService) {
    super({
      credentials: {
        accessKeyId: configService.awsAccessKeyId,
        secretAccessKey: configService.awsSecretAccessKey,
      },
      endpoint: configService.awsEndpoint,
      forcePathStyle: true,
      region: configService.awsRegion,
    });
    this.logger.debug('AWS S3 service created!');
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