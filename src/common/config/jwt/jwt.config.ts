import { IsIn, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Algorithm } from 'jsonwebtoken';

export class JwtConfig {
  @IsIn(['HS256'])
  readonly algorithm: Algorithm = 'HS256';

  @IsString()
  readonly issuer: string = 'support@granite.com';

  @IsString()
  @IsNotEmpty()
  readonly secret!: string;

  @Matches(/^\d+[dhms]$/)
  readonly tokenExpiration: Api.ExpirationTime = '15m' as Api.ExpirationTime;
}
