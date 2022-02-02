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

  interface JwtPayload {
    uuid: Uuid;
  }

  namespace Entities {
    interface Document {
      uuid: Uuid;
      name: string;
      url: string;
      createdAt: Date;
      updatedAt?: Date;
      transaction?: Api.Entities.Transaction;
    }

    interface Transaction {
      uuid: Uuid;
      amount: number;
      reference: string;
      state: TransactionState;
      type: TransactionType;
      createdAt: Date;
      updatedAt?: Date;
      documents: Api.Entities.Document[];
      wallet?: Api.Entities.Wallet;
    }

    interface User {
      uuid: Uuid;
      email: Email;
      password: string;
      createdAt: Date;
      updatedAt?: Date;
      wallets: Api.Entities.Wallet[];
    }

    interface Wallet {
      uuid: Uuid;
      balance: number;
      name: string;
      createdAt: Date;
      updatedAt?: Date;
      transactions: Api.Entities.Transaction[];
      user?: Api.Entities.User;
    }
  }

  namespace Repositories {
    namespace Requests {
      // Document
      interface CreateDocument {
        name: string;
        transactionUuid: Uuid;
        url: string;
        uuid: Uuid;
      }

      // Transaction
      interface CreateTransaction {
        amount: number;
        reference: string;
        state: TransactionState;
        type: TransactionType;
        walletUuid: Uuid;
      }

      interface FindByTransactionAndUserUuid {
        transactionUuid: Uuid;
        userUuid: Uuid;
      }

      // User
      interface CreateUser {
        email: Email;
        password: string;
      }

      interface DeleteUser {
        userUuid: Uuid;
      }

      interface FindByUserUuid {
        userUuid: Uuid;
      }

      interface FindByValidCredentials {
        email: Email;
        password: string;
      }

      // Wallet
      interface CreateWallet {
        balance: number;
        name: string;
        userUuid: Uuid;
      }

      interface FindByWalletAndUserUuid {
        userUuid: Uuid;
        walletUuid: Uuid;
      }

      interface UpdateBalance {
        balance: number;
        walletUuid: Uuid;
      }
    }
    namespace Responses {
      interface DeleteResult {
        affected?: Nullable<number>;
      }

      interface UpdateResult {
        affected?: Nullable<number>;
      }
    }

    interface Document {
      create(data: Api.Repositories.Requests.CreateDocument): Promise<Api.Entities.Document>;
    }

    interface Transaction {
      create(data: Api.Repositories.Requests.CreateTransaction): Promise<Api.Entities.Transaction>;
      findByTransactionAndUserUuid(
        data: Api.Repositories.Requests.FindByTransactionAndUserUuid,
      ): Promise<Api.Entities.Transaction | undefined>;
      findByTransactionAndUserUuidOrFail(
        data: Api.Repositories.Requests.FindByTransactionAndUserUuid,
      ): Promise<Api.Entities.Transaction>;
    }

    interface User {
      create(data: Api.Repositories.Requests.CreateUser): Promise<Api.Entities.User>;
      delete(
        data: Api.Repositories.Requests.DeleteUser,
      ): Promise<Api.Repositories.Responses.DeleteResult>;
      findByUserUuid(
        data: Api.Repositories.Requests.FindByUserUuid,
      ): Promise<Api.Entities.User | undefined>;
      findByUserUuidOrFail(
        data: Api.Repositories.Requests.FindByUserUuid,
      ): Promise<Api.Entities.User>;
      findByValidCredentials(
        data: Api.Repositories.Requests.FindByValidCredentials,
      ): Promise<Api.Entities.User | undefined>;
    }

    interface Wallet {
      create(data: Api.Repositories.Requests.CreateWallet): Promise<Api.Entities.Wallet>;
      findByWalletAndUserUuid(
        data: Api.Repositories.Requests.FindByWalletAndUserUuid,
      ): Promise<Api.Entities.Wallet | undefined>;
      findByWalletAndUserUuidOrFail(
        data: Api.Repositories.Requests.FindByWalletAndUserUuid,
      ): Promise<Api.Entities.Wallet>;
      updateBalance(
        data: Api.Repositories.Requests.UpdateBalance,
      ): Promise<Api.Repositories.Responses.UpdateResult>;
    }
  }

  namespace Services {
    type CallHandler<T> = import('@nestjs/common').CallHandler<T>;
    type Observable<T> = import('rxjs').Observable<T>;
    type EntityManager = import('typeorm').EntityManager;

    interface DatabaseTransaction {
      getManager(): EntityManager;
      execute<T>(next: (manager: EntityManager) => Promise<T>): Promise<T>;
      executeHandler<T>(next: CallHandler<Observable<T>>): Promise<Observable<T>>;
    }
  }
}
