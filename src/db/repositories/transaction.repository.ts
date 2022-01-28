import { Connection } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';
import { NotFoundError } from '$/common/error';
import { TransactionWalletUserRepository } from '$/db/repositories/aggregate/transaction-wallet-user.repository';
import { TransactionEntityRepository } from '$/db/repositories/entity/transaction-entity.repository';
import { WalletEntityRepository } from '$/db/repositories/entity/wallet-entity.repository';

@Injectable()
export class TransactionRepository implements Api.Repositories.Transaction {
  constructor(
    @InjectConnection()
    protected readonly connection: Connection,
    // Aggregate Repositories
    private readonly transactionWalletUserRepository: TransactionWalletUserRepository,
    // Entity Repositories
    private readonly transactionEntityRepository: TransactionEntityRepository,
    private readonly walletEntityRepository: WalletEntityRepository,
  ) {}

  create(data: {
    amount: number;
    reference: string;
    state: TransactionState;
    type: TransactionType;
    walletUuid: Uuid;
  }): Promise<Api.Entities.Transaction> {
    return this.transactionEntityRepository.create(data);
  }

  findByUuid(data: {
    transactionUuid: Uuid;
    userUuid: Uuid;
  }): Promise<Api.Entities.Transaction | undefined> {
    return this.transactionWalletUserRepository.findByTransactionUuid(data);
  }

  async findByUuidOrFail(data: {
    transactionUuid: Uuid;
    userUuid: Uuid;
  }): Promise<Api.Entities.Transaction> {
    const transaction = await this.findByUuid(data);
    if (!transaction) {
      throw new NotFoundError(`Transaction with uuid: ${data.transactionUuid} does not exist.`);
    }
    return transaction;
  }

  process(data: { balance: number; transactionUuid: Uuid; walletUuid: Uuid }): Promise<void> {
    return this.connection.manager.transaction(async (manager) => {
      await this.walletEntityRepository.updateBalance(
        {
          balance: data.balance,
          walletUuid: data.walletUuid,
        },
        manager,
      );
      await this.transactionEntityRepository.updateState(
        {
          state: TransactionState.Processed,
          transactionUuid: data.transactionUuid,
        },
        manager,
      );
    });
  }

  updateState(data: {
    state: TransactionState;
    transactionUuid: Uuid;
  }): Promise<Api.Repositories.Responses.UpdateResult> {
    return this.transactionEntityRepository.updateState(data);
  }
}
