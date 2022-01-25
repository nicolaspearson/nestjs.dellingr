import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from '$/auth/auth.controller';
import { AuthService } from '$/auth/auth.service';
import { UserRepository } from '$/db/repositories/user.repository';
import { TokenModule } from '$/token/token.module';

@Module({
  controllers: [AuthController],
  imports: [TokenModule, TypeOrmModule.forFeature([UserRepository])],
  providers: [AuthService],
})
export class AuthModule {}
