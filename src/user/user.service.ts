import { Injectable, Logger } from '@nestjs/common';

import { UserProfileResponse } from '$/common/dto';
import { BadRequestError, NotFoundError } from '$/common/error';
import User from '$/db/entities/user.entity';
import { UserRepository } from '$/db/repositories/user.repository';

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
    await this.userRepository.delete(userUuid);
  }

  /**
   * Retrieves a user using the provided credentials.
   *
   * @param email The user's email address
   * @param password The user's password
   * @returns The {@link User} that was found using the provided credentials or undefined
   * if the provided credentials are invalid or the user does not exist.
   *
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async findByValidCredentials(email: Email, password: string): Promise<User | undefined> {
    return this.userRepository.findByValidCredentials(email, password);
  }

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
    const user = await this.userRepository.findByUserUuid(userUuid);
    if (!user) {
      throw new NotFoundError('User does not exist.');
    }
    return user;
  }

  /**
   * Creates a new user and wallet entry in the database.
   *
   * @param email The user's email address.
   * @param password The user's plain-text password.
   *
   * @throws {@link BadRequestError} If the user already exists.
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
      throw new BadRequestError('Invalid email address or password provided.');
    }
  }
}
