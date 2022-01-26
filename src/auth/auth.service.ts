import { Injectable, Logger } from '@nestjs/common';

import { JwtResponse } from '$/common/dto';
import { InternalServerError, NotFoundError } from '$/common/error';
import { TokenService } from '$/token/token.service';
import { UserService } from '$/user/user.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  /**
   * Generates a new JWT for a user.
   *
   * @param user The user's uuid
   * @returns The generated JWT.
   */
  private async generateJwt(userUuid: Uuid): Promise<string> {
    try {
      // Generate and return a JWT
      const token = await this.tokenService.generate({ uuid: userUuid });
      return token;
    } catch (error) {
      /* istanbul ignore next: ignore for integration test coverage */
      this.logger.error(`An error occurred while generating a new Jwt.`, error);
      /* istanbul ignore next: ignore for integration test coverage */
      throw new InternalServerError();
    }
  }

  /**
   * Authenticates a user using the provided credentials.
   *
   * @param email The user's email address
   * @param password The user's password
   * @returns A {@link JwtResponse} that a user can use to access with authenticated endpoints.
   *
   * @throws {@link NotFoundError} If the provided credentials are invalid or the user does not exist.
   * @throws {@link InternalServerError} If the JWT could not be generated.
   */
  async authenticate(email: Email, password: string): Promise<JwtResponse> {
    this.logger.log(`User with email: ${email} is attempting to login`);
    const user = await this.userService.findByValidCredentials(email, password);
    if (user) {
      const jwt = await this.generateJwt(user.uuid);
      return new JwtResponse({ token: jwt as JwtToken });
    }
    // Always return the same error if a login attempt fails in order to avoid user
    // enumeration attacks, however we are still vulnerable to a timing attack which
    // is out of scope for the moment.
    throw new NotFoundError('Invalid email address or password provided.');
  }
}
