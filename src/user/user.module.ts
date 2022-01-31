import { Module } from '@nestjs/common';

import { DatabaseModule } from '$/db/database.module';
import { UserController } from '$/user/user.controller';
import { UserService } from '$/user/user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [DatabaseModule],
  providers: [UserService],
})
export class UserModule {}
