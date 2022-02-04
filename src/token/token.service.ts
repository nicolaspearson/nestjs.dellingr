import { v4 as uuid } from 'uuid';

import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Config } from '$/common/config/environment.config';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(protected readonly config: Config, private readonly jwtService: JwtService) {
    this.logger.debug('Token service created!');
  }

  /**
   * Generates a JWT with the provided payload.
   *
   * @param payload The payload that will included in the JWT as claims.
   */
  async generate(payload: Api.JwtPayload): Promise<JwtToken> {
    this.logger.log(`Generating JWT for user with uuid: ${payload.uuid}`);
    const token = await this.jwtService.signAsync(payload, {
      // Set the `exp` here to include it in the claims.
      expiresIn: this.config.jwtTokenExpiration,
      // Set the `jti` to avoid replay attacks.
      jwtid: uuid(),
    });
    return token as JwtToken;
  }
}
