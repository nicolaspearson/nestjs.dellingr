import { EntityManager } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable, Logger } from '@nestjs/common';

import { Document } from '$/db/entities/document.entity';
import { DatabaseTransactionService } from '$/db/services/database-transaction.service';

@Injectable()
export class DocumentRepository implements Api.Repositories.Document {
  private readonly logger: Logger = new Logger(DocumentRepository.name);

  constructor(private readonly databaseTransactionService: DatabaseTransactionService) {
    this.logger.debug('Document repository created!');
  }

  private getManager(): EntityManager {
    return this.databaseTransactionService.getManager();
  }

  create(data: Api.Repositories.Requests.CreateDocument): Promise<Api.Entities.Document> {
    const partialDocument: QueryDeepPartialEntity<Api.Entities.Document> = {
      key: data.key,
      name: data.name,
      transaction: {
        uuid: data.transactionUuid,
      },
      uuid: data.uuid,
    };
    return this.getManager().save(Document, partialDocument as Document);
  }
}
