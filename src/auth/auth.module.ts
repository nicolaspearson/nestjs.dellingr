import { Module } from '@nestjs/common';

import { AuthController } from '$/auth/auth.controller';
import { AuthService } from '$/auth/auth.service';
import { DatabaseModule } from '$/db/database.module';
import { TokenModule } from '$/token/token.module';
import { UserModule } from '$/user/user.module';

@Module({
  controllers: [AuthController],
  imports: [DatabaseModule, TokenModule, UserModule],
  providers: [AuthService],
})
export class AuthModule {}
