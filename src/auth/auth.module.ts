import { Module } from '@nestjs/common';

import { AuthController } from '$/auth/auth.controller';
import { AuthService } from '$/auth/auth.service';
import { TokenModule } from '$/token/token.module';
import { UserModule } from '$/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [TokenModule, UserModule],
  providers: [AuthService],
})
export class AuthModule {}
