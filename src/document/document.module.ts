import { Module } from '@nestjs/common';

import { AwsS3Service } from '$/common/services/aws-s3.service';
import { DatabaseModule } from '$/db/database.module';
import { DocumentController } from '$/document/document.controller';
import { DocumentService } from '$/document/document.service';

@Module({
  controllers: [DocumentController],
  imports: [DatabaseModule],
  providers: [AwsS3Service, DocumentService],
})
export class DocumentModule {}
