import { AsyncLocalStorage } from 'async_hooks';
import { Observable, lastValueFrom } from 'rxjs';
import { DataSource, EntityManager } from 'typeorm';

import { CallHandler, Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

interface Store {
  manager: EntityManager;
}

@Injectable()
export class DatabaseTransactionService implements Api.Services.DatabaseTransaction {
  private readonly logger: Logger = new Logger(DatabaseTransactionService.name);
  private readonly storage = new AsyncLocalStorage<Store>();

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {
    this.logger.debug('Database transaction service created!');
  }

  getManager(): EntityManager {
    const store = this.storage.getStore();
    if (!store?.manager) {
      return this.dataSource.manager;
    }
    return store.manager;
  }

  execute<T>(next: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      return this.storage.run({ manager }, () => {
        return next(manager);
      });
    });
  }

  executeHandler<T>(next: CallHandler<Observable<T>>): Promise<Observable<T>> {
    return this.dataSource.transaction((manager) => {
      return this.storage.run({ manager }, () => {
        return lastValueFrom(next.handle());
      });
    });
  }
}
