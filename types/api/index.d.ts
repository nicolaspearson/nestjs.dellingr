type Nullable<T> = T | null;
type PublicOnly<T> = Pick<T, keyof T>;

declare const type: unique symbol;
type Opaque<K, T> = K & { readonly [type]: T };

type Email = Opaque<string, 'Email'>;
type JwtToken = Opaque<string, 'JwtToken'>;
type Uuid = Opaque<string, 'Uuid'>;

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
      key: string;
      name: string;
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
        key: string;
        name: string;
        transactionUuid: Uuid;
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
      ): Promise<Nullable<Api.Entities.Transaction>>;
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
      ): Promise<Nullable<Api.Entities.User>>;
      findByUserUuidOrFail(
        data: Api.Repositories.Requests.FindByUserUuid,
      ): Promise<Api.Entities.User>;
      findByValidCredentials(
        data: Api.Repositories.Requests.FindByValidCredentials,
      ): Promise<Nullable<Api.Entities.User>>;
    }

    interface Wallet {
      create(data: Api.Repositories.Requests.CreateWallet): Promise<Api.Entities.Wallet>;
      findByWalletAndUserUuid(
        data: Api.Repositories.Requests.FindByWalletAndUserUuid,
      ): Promise<Nullable<Api.Entities.Wallet>>;
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
