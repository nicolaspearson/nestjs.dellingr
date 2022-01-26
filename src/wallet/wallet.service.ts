import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { WalletResponse } from '$/common/dto';
import { WalletRepository } from '$/db/repositories/wallet.repository';

@Injectable()
export class WalletService {
  private readonly logger: Logger = new Logger(WalletService.name);

  constructor(
    @InjectRepository(WalletRepository)
    private readonly walletRepository: WalletRepository,
  ) {}

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
}
