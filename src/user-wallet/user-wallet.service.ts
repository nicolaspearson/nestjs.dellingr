import { Injectable, Logger } from '@nestjs/common';

import { BadRequestError } from '$/common/error';
import { UserWalletRepository } from '$/db/repositories/user-wallet.repository';

@Injectable()
export class UserWalletService {
  private readonly logger: Logger = new Logger(UserWalletService.name);

  constructor(private readonly userWalletRepository: UserWalletRepository) {}

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
      const user = await this.userWalletRepository.create({ email, password });
      this.logger.log(`Successfully registered user with email address: ${user.email}`);
    } catch {
      throw new BadRequestError('Invalid email address or password provided.');
    }
  }
}
