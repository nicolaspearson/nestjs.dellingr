import { Connection, EntityManager } from 'typeorm';

import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

// Source: https://github.com/LuanMaik/nestjs-unit-of-work
@Injectable({
  // This will always create a new instance of the controller, service, and
  // repository for every HTTP request that the application receives, regardless
  // of whether or not the the function call is wrapped in a unit-of-work.
  scope: Scope.REQUEST,
})
export class UnitOfWorkService {
  private manager: EntityManager;

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {
    // Set the default entity manager
    this.manager = this.connection.manager;
  }

  getManager() {
    return this.manager;
  }

  async doTransactional<T>(doWork: (manager: EntityManager) => Promise<T>): Promise<T> {
    return await this.connection.transaction(async (manager) => {
      // Share the entity manager
      this.manager = manager;
      // Executes the transactional work
      return doWork(manager);
    });
  }
}
