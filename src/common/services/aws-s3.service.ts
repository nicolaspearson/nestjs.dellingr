import { S3 } from 'aws-sdk';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private readonly client: S3;

  constructor(protected readonly configService: ConfigService) {
    // This needs to be done in this way because the aws-sdk has been compiled with
    // ES5, extending the class and using super instead results in the following error:
    //
    //   Class constructor AwsS3Service cannot be invoked without 'new'
    //
    // Switching to v3 of the aws-sdk should solve this problem.
    this.client = new S3({
      accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
      region: configService.get<string>('AWS_REGION'),
      secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    });
  }

  getClient(): S3 {
    return this.client;
  }
}
