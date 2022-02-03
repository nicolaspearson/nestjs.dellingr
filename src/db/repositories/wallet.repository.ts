import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from '$/common/error';
import { Wallet } from '$/db/entities/wallet.entity';
import { DatabaseTransactionService } from '$/db/services/database-transaction.service';

type QueryOptions = {
  withTransactions: boolean;
};

@Injectable()
export class WalletRepository implements Api.Repositories.Wallet {
  private readonly logger: Logger = new Logger(WalletRepository.name);

  constructor(private readonly databaseTransactionService: DatabaseTransactionService) {
    this.logger.debug('Wallet repository created!');
  }

  private getManager(): EntityManager {
    return this.databaseTransactionService.getManager();
  }

  private query(options?: QueryOptions): SelectQueryBuilder<Wallet> {
    const query = this.getManager().createQueryBuilder(Wallet, 'wallet');
    if (options?.withTransactions) {
      query.leftJoinAndSelect('wallet.transactions', 'transactions');
    }
    return query;
  }

  create(data: Api.Repositories.Requests.CreateWallet): Promise<Api.Entities.Wallet> {
    const partialWallet: QueryDeepPartialEntity<Wallet> = {
      balance: data.balance,
      name: data.name,
      transactions: [],
      user: {
        uuid: data.userUuid,
      },
    };
    return this.getManager().save(Wallet, partialWallet as Wallet);
  }

  findByWalletAndUserUuid(
    data: Api.Repositories.Requests.FindByWalletAndUserUuid,
  ): Promise<Api.Entities.Wallet | undefined> {
    return this.query({ withTransactions: true })
      .where({
        uuid: data.walletUuid,
        user: {
          uuid: data.userUuid,
        },
      })
      .getOne();
  }

  async findByWalletAndUserUuidOrFail(
    data: Api.Repositories.Requests.FindByWalletAndUserUuid,
  ): Promise<Api.Entities.Wallet> {
    const wallet = await this.findByWalletAndUserUuid(data);
    if (!wallet) {
      throw new NotFoundError(`Wallet with uuid: ${data.userUuid} does not exist.`);
    }
    return wallet;
  }

  updateBalance(
    data: Api.Repositories.Requests.UpdateBalance,
  ): Promise<Api.Repositories.Responses.UpdateResult> {
    return this.getManager()
      .createQueryBuilder()
      .update(Wallet)
      .set({ balance: data.balance })
      .where({
        uuid: data.walletUuid,
      })
      .execute();
  }
}
