import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { TypedConfigModule } from 'nest-typed-config';

import { Config } from '$/common/config/environment.config';
import { TokenService } from '$/token/token.service';

@Module({
  exports: [TokenService],
  imports: [
    TypedConfigModule,
    JwtModule.registerAsync({
      imports: [TypedConfigModule],
      useFactory: (config: Config): JwtModuleOptions => ({
        secret: config.jwtSecret,
        signOptions: {
          algorithm: config.jwtAlgorithm,
          expiresIn: config.jwtTokenExpiration,
          issuer: config.jwtIssuer,
        },
      }),
      inject: [Config],
    }),
  ],
  providers: [TokenService],
})
export class TokenModule {}
