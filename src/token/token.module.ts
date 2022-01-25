import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

import { TokenService } from '$/token/token.service';

@Module({
  exports: [TokenService],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          algorithm: configService.get('JWT_ALGORITHM'),
          expiresIn: configService.get('JWT_TOKEN_EXPIRATION'),
          issuer: configService.get('JWT_ISSUER'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService],
})
export class TokenModule {}
