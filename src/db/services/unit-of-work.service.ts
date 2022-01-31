import { Connection, EntityManager } from 'typeorm';

import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable({
  scope: Scope.REQUEST, // <-- VERY IMPORTANT to create one instance per request
})
export class UnitOfWorkService {
  private manager: EntityManager;

  constructor(
    @InjectConnection()
    private readonly connection: Connection, // <-- get the database connection
  ) {
    this.manager = this.connection.manager; // <-- set the default manager
  }

  getManager() {
    return this.manager;
  }

  async doTransactional<T>(doWork: (manager: EntityManager) => Promise<T>): Promise<T> {
    return await this.connection.transaction(async (manager) => {
      this.manager = manager; // <-- set the entity manager to share
      return doWork(manager); // <-- executes the transactional work
    });
  }
}
