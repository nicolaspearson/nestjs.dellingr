import { AsyncLocalStorage } from 'async_hooks';
import { Observable, lastValueFrom } from 'rxjs';
import { Connection, EntityManager } from 'typeorm';

import { CallHandler, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

interface Store {
  manager: EntityManager;
}

@Injectable()
export class DatabaseTransactionService {
  private readonly storage = new AsyncLocalStorage<Store>();

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  getManager(): EntityManager {
    const store = this.storage.getStore();
    if (!store?.manager) {
      return this.connection.createEntityManager();
    }
    return store.manager;
  }

  execute<T>(next: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.connection.transaction(async (manager) => {
      return this.storage.run({ manager }, () => {
        return next(manager);
      });
    });
  }

  executeHandler<T>(next: CallHandler<Observable<T>>): Promise<Observable<T>> {
    return this.connection.transaction((manager) => {
      return this.storage.run({ manager }, () => {
        return lastValueFrom(next.handle());
      });
    });
  }
}
