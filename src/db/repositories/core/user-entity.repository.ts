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

  delete(data: { userUuid: Uuid }): Promise<DeleteResult> {
    return this.query().delete().where({ uuid: data.userUuid }).execute();
  }

  findByValidCredentials(data: { email: Email; password: string }): Promise<User | undefined> {
    // We use the pgcrypto extension to compare the hashed password to the plain text version
    return this.query()
      .where({ email: data.email })
      .andWhere('user.password = crypt(:password, user.password)', { password: data.password })
      .getOne();
  }
}
