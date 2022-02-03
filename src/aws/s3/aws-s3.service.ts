/* eslint-disable @typescript-eslint/naming-convention */
import { S3Client, ServiceOutputTypes } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service extends S3Client {
  private readonly logger: Logger = new Logger(AwsS3Service.name);

  constructor(protected readonly configService: ConfigService) {
    super({
      credentials: {
        /* eslint-disable @typescript-eslint/no-non-null-assertion */
        accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      },
      endpoint: configService.get<string>('AWS_ENDPOINT'),
      forcePathStyle: true,
      region: configService.get<string>('AWS_REGION'),
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
