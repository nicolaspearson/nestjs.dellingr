import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '$/db/repositories/user.repository';
import { UserWalletTransactionModule } from '$/user-wallet-transaction/user-wallet-transaction.module';
import { UserWalletModule } from '$/user-wallet/user-wallet.module';
import { UserController } from '$/user/user.controller';
import { UserService } from '$/user/user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    UserWalletModule,
    UserWalletTransactionModule,
  ],
  providers: [UserService],
})
export class UserModule {}
