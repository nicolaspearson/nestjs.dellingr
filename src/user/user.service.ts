import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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
}
