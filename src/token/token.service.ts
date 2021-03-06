import { v4 as uuid } from 'uuid';

import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ConfigService } from '$/common/config/config.service';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  constructor(
    protected readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
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
      expiresIn: this.configService.jwt.tokenExpiration,
      // Set the `jti` to avoid replay attacks.
      jwtid: uuid(),
    });
    return token as JwtToken;
  }
}
