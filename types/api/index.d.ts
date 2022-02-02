type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };
type PublicOnly<T> = Pick<T, keyof T>;

type Email = Opaque<'Email', string>;
type JwtToken = Opaque<'JwtToken', string>;
type Uuid = Opaque<'Uuid', string>;

declare namespace Api {
  type Request = import('express').Request;
  interface AuthenticatedRequest extends Request {
    userUuid: Uuid;
  }

  type TransactionState = import('$/common/enum/transaction-state.enum').TransactionState;
  type TransactionType = import('$/common/enum/transaction-type.enum').TransactionType;

  type ExpirationTime = Opaque<'ExpirationTime', string>;

  interface Error {
    code: number;
    errors?: string[] | Record<string, unknown>[];
    message: string;
    name: string;
  }

  type JwtPayload = {
    uuid: Uuid;
  };

  namespace Entities {
    type Transaction = {
      uuid: Uuid;
      amount: number;
      reference: string;
      state: TransactionState;
      type: TransactionType;
      createdAt: Date;
      updatedAt?: Date;
      wallet: Api.Entities.Wallet;
    };

    type User = {
      uuid: Uuid;
      email: Email;
      password: string;
      createdAt: Date;
      updatedAt?: Date;
      wallets: Api.Entities.Wallet[];
    };

    type Wallet = {
      uuid: Uuid;
      balance: number;
      name: string;
      createdAt: Date;
      updatedAt?: Date;
      transactions: Api.Entities.Transaction[];
      user: Api.Entities.User;
    };
  }

  namespace Repositories {
    namespace Responses {
      type DeleteResult = {
        affected?: Nullable<number>;
      };

      type UpdateResult = {
        affected?: Nullable<number>;
      };
    }

    type Transaction = {
      create(data: {
        amount: number;
        reference: string;
        state: TransactionState;
        type: TransactionType;
        walletUuid: Uuid;
      }): Promise<Api.Entities.Transaction>;
      findByTransactionAndUserUuid(data: {
        transactionUuid: Uuid;
        userUuid: Uuid;
      }): Promise<Api.Entities.Transaction | undefined>;
      findByTransactionAndUserUuidOrFail(data: {
        transactionUuid: Uuid;
        userUuid: Uuid;
      }): Promise<Api.Entities.Transaction>;
    };

    type User = {
      create(data: { email: Email; password: string }): Promise<Api.Entities.User>;
      delete(data: { userUuid: Uuid }): Promise<Api.Repositories.Responses.DeleteResult>;
      findByUserUuid(data: { userUuid: Uuid }): Promise<Api.Entities.User | undefined>;
      findByUserUuidOrFail(data: { userUuid: Uuid }): Promise<Api.Entities.User>;
      findByValidCredentials(data: {
        email: Email;
        password: string;
      }): Promise<Api.Entities.User | undefined>;
    };

    type Wallet = {
      create(data: { balance: number; name: string; userUuid: Uuid }): Promise<Api.Entities.Wallet>;
      findByWalletAndUserUuid(data: {
        userUuid: Uuid;
        walletUuid: Uuid;
      }): Promise<Api.Entities.Wallet | undefined>;
      findByWalletAndUserUuidOrFail(data: {
        userUuid: Uuid;
        walletUuid: Uuid;
      }): Promise<Api.Entities.Wallet>;
      updateBalance(data: {
        balance: number;
        walletUuid: Uuid;
      }): Promise<Api.Repositories.Responses.UpdateResult>;
    };
  }

  namespace Services {
    type CallHandler<T> = import('@nestjs/common').CallHandler<T>;
    type Observable<T> = import('rxjs').Observable<T>;
    type EntityManager = import('typeorm').EntityManager;

    type DatabaseTransaction = {
      getManager(): EntityManager;
      execute<T>(next: (manager: EntityManager) => Promise<T>): Promise<T>;
      executeHandler<T>(next: CallHandler<Observable<T>>): Promise<Observable<T>>;
    };
  }
}
