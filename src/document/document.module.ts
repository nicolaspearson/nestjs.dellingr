import { Module } from '@nestjs/common';

import { DatabaseModule } from '$/db/database.module';
import { DocumentController } from '$/document/document.controller';
import { DocumentService } from '$/document/document.service';

@Module({
  controllers: [DocumentController],
  imports: [DatabaseModule],
  providers: [DocumentService],
})
export class DocumentModule {}
