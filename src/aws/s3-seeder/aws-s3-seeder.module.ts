import { Module } from '@nestjs/common';

import { AwsS3SeederService } from '$/aws/s3-seeder/aws-s3-seeder.service';
import { AwsS3Module } from '$/aws/s3/aws-s3.module';

@Module({
  exports: [AwsS3SeederService],
  imports: [AwsS3Module],
  providers: [AwsS3SeederService],
})
export class AwsS3SeederModule {}
