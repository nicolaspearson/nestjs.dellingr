import {
  AbstractRepository,
  DeleteResult,
  EntityManager,
  EntityRepository,
  SelectQueryBuilder,
} from 'typeorm';

import { Injectable } from '@nestjs/common';

import User from '$/db/entities/user.entity';

@Injectable()
@EntityRepository(User)
export class UserRepository extends AbstractRepository<User> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  private userQuery(): SelectQueryBuilder<User> {
    return this.manager.createQueryBuilder(User, 'user');
  }

  delete(uuid: Uuid): Promise<DeleteResult> {
    return this.userQuery().delete().where({ uuid }).execute();
  }

  findByValidCredentials(email: Email, password: string): Promise<User | undefined> {
    // We use the pgcrypto extension to compare the hashed password to the plain text version
    return this.userQuery()
      .where({ email })
      .andWhere('user.password = crypt(:password, user.password)', { password })
      .getOne();
  }
}
