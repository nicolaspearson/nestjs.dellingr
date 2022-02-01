import { v4 as uuidv4 } from 'uuid';

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);

  private readonly tokenExpiration: Api.ExpirationTime;

  constructor(
    protected readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.logger.debug('Token service created!');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.tokenExpiration = configService.get<Api.ExpirationTime>('JWT_TOKEN_EXPIRATION')!;
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
      expiresIn: this.tokenExpiration,
      // Set the `jti` to avoid replay attacks.
      jwtid: uuidv4(),
    });
    return token as JwtToken;
  }
}
