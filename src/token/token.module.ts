import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypedConfigModule } from 'nest-typed-config';

import { ConfigService } from '$/common/config/environment.config';
import { TokenService } from '$/token/token.service';

@Module({
  exports: [TokenService],
  imports: [
    TypedConfigModule,
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      useFactory: (configService: ConfigService): JwtModuleOptions => ({
        secret: configService.jwtSecret,
        signOptions: {
          algorithm: configService.jwtAlgorithm,
          expiresIn: configService.jwtTokenExpiration,
          issuer: configService.jwtIssuer,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TokenService],
})
export class TokenModule {}
