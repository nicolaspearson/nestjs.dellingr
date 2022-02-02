import { EntityManager, SelectQueryBuilder } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

import { Injectable, Logger } from '@nestjs/common';

import { NotFoundError } from '$/common/error';
import { DatabaseTransactionService } from '$/common/services/database-transaction.service';
import Wallet from '$/db/entities/wallet.entity';

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

  create(data: { balance: number; name: string; userUuid: Uuid }): Promise<Api.Entities.Wallet> {
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

  findByWalletAndUserUuid(data: {
    userUuid: Uuid;
    walletUuid: Uuid;
  }): Promise<Api.Entities.Wallet | undefined> {
    return this.query({ withTransactions: true })
      .where({
        uuid: data.walletUuid,
        user: {
          uuid: data.userUuid,
        },
      })
      .getOne();
  }

  async findByWalletAndUserUuidOrFail(data: {
    userUuid: Uuid;
    walletUuid: Uuid;
  }): Promise<Api.Entities.Wallet> {
    const wallet = await this.findByWalletAndUserUuid(data);
    if (!wallet) {
      throw new NotFoundError(`Wallet with uuid: ${data.userUuid} does not exist.`);
    }
    return wallet;
  }

  updateBalance(data: {
    balance: number;
    walletUuid: Uuid;
  }): Promise<Api.Repositories.Responses.UpdateResult> {
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
