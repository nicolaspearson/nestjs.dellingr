import { Injectable, Logger } from '@nestjs/common';

import { ConflictError } from '$/common/error';
import { UserRepository } from '$/db/repositories';

export const DEFAULT_WALLET_BALANCE = 0;
export const DEFAULT_WALLET_NAME = 'Main';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Deletes a user's account from the database.
   *
   * @param userUuid The uuid of the user.
   *
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async delete(userUuid: Uuid): Promise<void> {
    this.logger.log(`Deleting user with uuid: ${userUuid}`);
    await this.userRepository.delete({ userUuid });
  }

  /**
   * Retrieves a user's profile from the database.
   *
   * @param userUuid The uuid of the user.
   * @returns The {@link Api.Entities.User} object.
   *
   * @throws {@link NotFoundError} If the user does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  profile(userUuid: Uuid): Promise<Api.Entities.User> {
    this.logger.log(`Retrieving profile for user with uuid: ${userUuid}`);
    return this.userRepository.findByUuidOrFail({ userUuid });
  }

  /**
   * Creates a new user and wallet entry in the database.
   *
   * @param email The user's email address.
   * @param password The user's plain-text password.
   *
   * @throws {@link ConflictError} If the user already exists.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async register(email: Email, password: string): Promise<void> {
    this.logger.log(`Registering user with email address: ${email}`);
    try {
      const user = await this.userRepository.create({
        email,
        password,
        wallet: { balance: DEFAULT_WALLET_BALANCE, name: DEFAULT_WALLET_NAME },
      });
      this.logger.log(`Successfully registered user with email address: ${user.email}`);
    } catch {
      throw new ConflictError('The provided email address is already in use.');
    }
  }
}
