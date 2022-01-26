import { Injectable, Logger } from '@nestjs/common';

import { WalletResponse } from '$/common/dto';
import { NotFoundError } from '$/common/error';
import Wallet from '$/db/entities/wallet.entity';
import { WalletTransactionRepository } from '$/db/repositories/wallet-transaction.repository';

@Injectable()
export class WalletTransactionService {
  private readonly logger: Logger = new Logger(WalletTransactionService.name);

  constructor(private readonly walletTransactionRepository: WalletTransactionRepository) {}

  /**
   * Retrieves the specified user wallet from the database.
   *
   * @param userUuid The uuid of the user.
   * @param walletUuid The uuid of the wallet.
   * @returns The {@link WalletResponse} object.
   *
   * @throws {@link NotFoundError} If the wallet does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async getById(userUuid: Uuid, walletUuid: Uuid): Promise<WalletResponse> {
    this.logger.log(`Retrieving user wallet with uuid: ${userUuid} & wallet uuid: ${walletUuid}`);
    const wallet = await this.findWalletOrFail(userUuid, walletUuid);
    return new WalletResponse(wallet);
  }

  private async findWalletOrFail(userUuid: Uuid, walletUuid: Uuid): Promise<Wallet> {
    const wallet = await this.walletTransactionRepository.findByWalletUuid(userUuid, walletUuid);
    if (!wallet) {
      throw new NotFoundError('Wallet does not exist.');
    }
    return wallet;
  }
}
