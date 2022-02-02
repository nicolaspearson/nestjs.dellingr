import { Observable } from 'rxjs';

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { DatabaseTransactionService } from '$/common/services/database-transaction.service';

@Injectable()
export class DatabaseTransactionInterceptor<T> implements NestInterceptor {
  constructor(private readonly databaseTransactionService: DatabaseTransactionService) {}

  intercept(_: ExecutionContext, next: CallHandler<Observable<T>>): Promise<Observable<T>> {
    return this.databaseTransactionService.executeHandler<T>(next);
  }
}
