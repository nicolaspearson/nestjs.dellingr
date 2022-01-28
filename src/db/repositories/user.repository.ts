import { Injectable } from '@nestjs/common';

import { NotFoundError } from '$/common/error';
import { UserWalletTransactionRepository } from '$/db/repositories/aggregate/user-wallet-transaction.repository';
import { UserWalletRepository } from '$/db/repositories/aggregate/user-wallet.repository';
import { UserEntityRepository } from '$/db/repositories/entity/user-entity.repository';

@Injectable()
export class UserRepository implements Api.Repositories.User {
  constructor(
    // Aggregate Repositories
    private readonly userWalletTransactionRepository: UserWalletTransactionRepository,
    private readonly userWalletRepository: UserWalletRepository,
    // Entity Repositories
    private readonly userEntityRepository: UserEntityRepository,
  ) {}

  async create(data: {
    email: Email;
    password: string;
    wallet: { balance: number; name: string };
  }): Promise<Api.Entities.User> {
    return this.userWalletRepository.create(data);
  }

  delete(data: { userUuid: Uuid }): Promise<Api.Repositories.Responses.DeleteResult> {
    return this.userEntityRepository.delete(data);
  }

  findByUuid(data: { userUuid: Uuid }): Promise<Api.Entities.User | undefined> {
    return this.userWalletTransactionRepository.findByUserUuid(data);
  }

  async findByUuidOrFail(data: { userUuid: Uuid }): Promise<Api.Entities.User> {
    const user = await this.findByUuid(data);
    if (!user) {
      throw new NotFoundError(`User with uuid: ${data.userUuid} does not exist.`);
    }
    return user;
  }

  findByValidCredentials(data: {
    email: Email;
    password: string;
  }): Promise<Api.Entities.User | undefined> {
    return this.userEntityRepository.findByValidCredentials(data);
  }
}
