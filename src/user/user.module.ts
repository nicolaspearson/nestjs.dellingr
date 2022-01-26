import { Module } from '@nestjs/common';

import { UserRepository } from '$/db/repositories/user.repository';
import { UserController } from '$/user/user.controller';
import { UserService } from '$/user/user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  providers: [UserRepository, UserService],
})
export class UserModule {}
