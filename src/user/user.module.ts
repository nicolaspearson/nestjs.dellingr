import { Module } from '@nestjs/common';

import { RepositoryModule } from '$/db/repositories';
import { UserController } from '$/user/user.controller';
import { UserService } from '$/user/user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [RepositoryModule],
  providers: [UserService],
})
export class UserModule {}
