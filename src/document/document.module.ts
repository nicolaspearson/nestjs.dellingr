import { Module } from '@nestjs/common';

import { AwsS3Module } from '$/aws/s3/aws-s3.module';
import { DatabaseModule } from '$/db/database.module';
import { DocumentController } from '$/document/document.controller';
import { DocumentService } from '$/document/document.service';

@Module({
  controllers: [DocumentController],
  imports: [AwsS3Module, DatabaseModule],
  providers: [DocumentService],
})
export class DocumentModule {}
