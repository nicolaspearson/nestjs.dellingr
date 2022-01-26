import { Module } from '@nestjs/common';

import { UserWalletRepository } from '$/db/repositories/user-wallet.repository';
import { UserWalletService } from '$/user-wallet/user-wallet.service';

@Module({
  exports: [UserWalletService],
  providers: [UserWalletRepository, UserWalletService],
})
export class UserWalletModule {}
