import { Module } from '@nestjs/common';

import { AwsS3Service } from '$/aws/s3/aws-s3.service';

@Module({
  exports: [AwsS3Service],
  providers: [AwsS3Service],
})
export class AwsS3Module {}
