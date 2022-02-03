import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from '$/common/error';
import { User } from '$/db/entities/user.entity';
import { DatabaseTransactionService } from '$/db/services/database-transaction.service';
import { generateSalt } from '$/db/utils/password.util';

type QueryOptions = {
  withWallets: boolean;
  withWalletTransactions: boolean;
};

@Injectable()
export class UserRepository implements Api.Repositories.User {
  private readonly logger: Logger = new Logger(UserRepository.name);

  constructor(private readonly databaseTransactionService: DatabaseTransactionService) {
    this.logger.debug('User repository created!');
  }

  private getManager(): EntityManager {
    return this.databaseTransactionService.getManager();
  }

  private query(options?: QueryOptions): SelectQueryBuilder<User> {
    const query = this.getManager().createQueryBuilder(User, 'user');
    if (options?.withWallets) {
      query.leftJoinAndSelect('user.wallets', 'wallets');
      if (options?.withWalletTransactions) {
        query.leftJoinAndSelect('wallets.transactions', 'transactions');
      }
    }
    return query;
  }

  async create(data: Api.Repositories.Requests.CreateUser): Promise<Api.Entities.User> {
    // Create the user with the required fields populated.
    const partialUser: QueryDeepPartialEntity<User> = {
      email: data.email,
      // The pgcrypto extension salts and hashes the user's password.
      password: generateSalt(data.password, "'bf', 8"),
    };
    return this.getManager().save(User, partialUser as User);
  }

  delete(
    data: Api.Repositories.Requests.DeleteUser,
  ): Promise<Api.Repositories.Responses.DeleteResult> {
    return this.query().delete().where({ uuid: data.userUuid }).execute();
  }

  findByUserUuid(
    data: Api.Repositories.Requests.FindByUserUuid,
  ): Promise<Api.Entities.User | undefined> {
    return this.query({ withWallets: true, withWalletTransactions: true })
      .where({ uuid: data.userUuid })
      .getOne();
  }

  async findByUserUuidOrFail(
    data: Api.Repositories.Requests.FindByUserUuid,
  ): Promise<Api.Entities.User> {
    const user = await this.findByUserUuid(data);
    if (!user) {
      throw new NotFoundError(`User with uuid: ${data.userUuid} does not exist.`);
    }
    return user;
  }

  findByValidCredentials(
    data: Api.Repositories.Requests.FindByValidCredentials,
  ): Promise<Api.Entities.User | undefined> {
    // We use the pgcrypto extension to compare the hashed password to the plain text version
    return this.query()
      .where({ email: data.email })
      .andWhere('user.password = crypt(:password, user.password)', { password: data.password })
      .getOne();
  }
}
