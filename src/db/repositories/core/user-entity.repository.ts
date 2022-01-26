import {
  AbstractRepository,
  DeleteResult,
  EntityManager,
  EntityRepository,
  SelectQueryBuilder,
} from 'typeorm';

import User from '$/db/entities/user.entity';

@EntityRepository(User)
export class UserEntityRepository extends AbstractRepository<User> {
  constructor(protected readonly manager: EntityManager) {
    super();
  }

  private query(): SelectQueryBuilder<User> {
    return this.manager.createQueryBuilder(User, 'user');
  }

  delete(uuid: Uuid): Promise<DeleteResult> {
    return this.query().delete().where({ uuid }).execute();
  }

  findByValidCredentials(email: Email, password: string): Promise<User | undefined> {
    // We use the pgcrypto extension to compare the hashed password to the plain text version
    return this.query()
      .where({ email })
      .andWhere('user.password = crypt(:password, user.password)', { password })
      .getOne();
  }
}
