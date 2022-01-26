import { Injectable, Logger } from '@nestjs/common';

import { WalletResponse } from '$/common/dto';
import { NotFoundError } from '$/common/error';
import Wallet from '$/db/entities/wallet.entity';
import { WalletRepository } from '$/db/repositories/wallet.repository';

@Injectable()
export class WalletService {
  private readonly logger: Logger = new Logger(WalletService.name);

  constructor(private readonly walletRepository: WalletRepository) {}

  /**
   * Creates a new wallet for the specified user.
   *
   * @param userUuid The uuid of the user.
   * @param walletName The name of the new wallet.
   * @returns The {@link WalletResponse} object.
   *
   * @throws {@link NotFoundError} If the user does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async create(userUuid: Uuid, walletName: string): Promise<WalletResponse> {
    // TODO: Check if the user exists!
    this.logger.log(`Creating new wallet: ${walletName} for user with uuid: ${userUuid}`);
    const wallet = await this.walletRepository.create({ userUuid, name: walletName });
    return new WalletResponse(wallet);
  }

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
    const wallet = await this.walletRepository.findByWalletUuid(userUuid, walletUuid);
    if (!wallet) {
      throw new NotFoundError('Wallet does not exist.');
    }
    return wallet;
  }
}
