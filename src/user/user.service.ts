import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserProfileResponse } from '$/common/dto';
import { BadRequestError } from '$/common/error';
import User from '$/db/entities/user.entity';
import { UserRepository } from '$/db/repositories/user.repository';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Deletes a user's account from the database.
   *
   * @param userUuid The uuid of the user.
   *
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async delete(userUuid: Uuid): Promise<void> {
    await this.userRepository.delete(userUuid);
  }

  /**
   * Retrieves a user's profile from the database.
   *
   * @param userUuid The uuid of the user.
   * @returns The {@link UserProfileResponse} object.
   *
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async profile(userUuid: Uuid): Promise<UserProfileResponse> {
    this.logger.log(`Retrieving profile for user with uuid: ${userUuid}`);
    const user = await this.userRepository.findByUuidOrFail(userUuid);
    return new UserProfileResponse(user);
  }

  /**
   * Creates a new user entry in the database.
   *
   * @param email The user's email address.
   * @param password The user's plain-text password.
   *
   * @throws {@link BadRequestError} If the user already exists.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async register(email: Email, password: string): Promise<void> {
    this.logger.log(`Registering user with email address: ${email}`);
    let user: User;
    try {
      user = await this.userRepository.create({ email, password });
      this.logger.log(`Successfully registered user with email address: ${user.email}`);
    } catch {
      throw new BadRequestError('Invalid email address or password provided.');
    }
  }
}
