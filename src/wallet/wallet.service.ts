import { Injectable, Logger } from '@nestjs/common';

import { CreateWalletRequest } from '$/common/dto';
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
   * @param dto The {@link CreateWalletRequest} object.
   * @returns The {@link Api.Entities.Wallet} object.
   *
   * @throws {@link NotFoundError} If the user does not exist.
   * @throws {@link InternalServerError} If the database transaction fails.
   */
  async create(userUuid: Uuid, dto: CreateWalletRequest): Promise<Api.Entities.Wallet> {
    // Check if the user exists
    const user = await this.userRepository.findByUuidOrFail({ userUuid });
    this.logger.log(`Creating new wallet: "${dto.name}" for user with uuid: ${user.uuid}`);
    return this.walletRepository.create({ name: dto.name, userUuid: user.uuid });
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
    this.logger.log(`Retrieving wallet with uuid: ${walletUuid} for user with uuid: ${userUuid}`);
    return this.walletRepository.findByUuidOrFail({ userUuid, walletUuid });
  }
}
