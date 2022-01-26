import { Injectable, Logger } from '@nestjs/common';

import { UserProfileResponse } from '$/common/dto';
import { NotFoundError } from '$/common/error';
import User from '$/db/entities/user.entity';
import { UserWalletTransactionRepository } from '$/db/repositories/user-wallet-transaction.repository';

@Injectable()
export class UserWalletTransactionService {
  private readonly logger: Logger = new Logger(UserWalletTransactionService.name);

  constructor(private readonly userWalletTransactionRepository: UserWalletTransactionRepository) {}

  /**
   * Retrieves a user's profile from the database.
   *
   * @param userUuid The uuid of the user.
   * @returns The {@link UserProfileResponse} object.
   *
   * @throws {@link NotFoundError} If the user does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async profile(userUuid: Uuid): Promise<UserProfileResponse> {
    this.logger.log(`Retrieving profile for user with uuid: ${userUuid}`);
    const user = await this.findByUserUuidOrFail(userUuid);
    return new UserProfileResponse(user);
  }

  private async findByUserUuidOrFail(userUuid: Uuid): Promise<User> {
    const user = await this.userWalletTransactionRepository.findByUserUuid(userUuid);
    if (!user) {
      throw new NotFoundError('User does not exist.');
    }
    return user;
  }
}
