import { Module } from '@nestjs/common';

import { AuthController } from '$/auth/auth.controller';
import { AuthService } from '$/auth/auth.service';
import { RepositoryModule } from '$/db/repositories';
import { TokenModule } from '$/token/token.module';
import { UserModule } from '$/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [RepositoryModule, TokenModule, UserModule],
  providers: [AuthService],
})
export class AuthModule {}
