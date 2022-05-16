import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypedConfigModuleExtended } from 'nest-typed-config-extended';

import { ConfigService } from '$/common/config/config.service';
import { TokenService } from '$/token/token.service';

@Module({
  exports: [TokenService],
  imports: [
    TypedConfigModuleExtended,
    JwtModule.registerAsync({
      imports: [TypedConfigModuleExtended],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.jwt.secret,
        signOptions: {
          algorithm: configService.jwt.algorithm,
          expiresIn: configService.jwt.tokenExpiration,
          issuer: configService.jwt.issuer,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService],
})
export class TokenModule {}
