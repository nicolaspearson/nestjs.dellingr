import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from '$/common/error';
import { UserRepository, WalletRepository } from '$/db/repositories';

@Injectable()
export class WalletService {
  private readonly logger: Logger = new Logger(WalletService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly walletRepository: WalletRepository,
  ) {}

  /**
   * Creates a new wallet for the specified user.
   *
   * @param userUuid The uuid of the user.
   * @param walletName The name of the new wallet.
   * @returns The {@link Api.Entities.Wallet} object.
   *
   * @throws {@link NotFoundError} If the user does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async create(userUuid: Uuid, walletName: string): Promise<Api.Entities.Wallet> {
    // Check if the user exists
    const user = await this.userRepository.findByUuid({ userUuid });
    if (!user) {
      throw new NotFoundError('User does not exist.');
    }
    this.logger.log(`Creating new wallet: ${walletName} for user with uuid: ${userUuid}`);
    return this.walletRepository.create({ userUuid, name: walletName });
  }

  /**
   * Retrieves the specified user wallet from the database.
   *
   * @param userUuid The uuid of the user.
   * @param walletUuid The uuid of the wallet.
   * @returns The {@link Api.Entities.Wallet} object.
   *
   * @throws {@link NotFoundError} If the wallet does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  getById(userUuid: Uuid, walletUuid: Uuid): Promise<Api.Entities.Wallet> {
    this.logger.log(
      `Retrieving user wallet with user uuid: ${userUuid} & wallet uuid: ${walletUuid}`,
    );
    return this.findWalletOrFail(userUuid, walletUuid);
  }

  private async findWalletOrFail(userUuid: Uuid, walletUuid: Uuid): Promise<Api.Entities.Wallet> {
    const wallet = await this.walletRepository.findByUuid({ userUuid, walletUuid });
    if (!wallet) {
      throw new NotFoundError('Wallet does not exist.');
    }
    return wallet;
  }
}
