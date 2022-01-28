type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };
type PublicOnly<T> = Pick<T, keyof T>;

type Email = Opaque<'Email', string>;
type JwtToken = Opaque<'JwtToken', string>;
type Uuid = Opaque<'Uuid', string>;

declare namespace Express {
  interface Request {
    userUuid?: Uuid;
  }
}

declare namespace Api {
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
      state: import('$/common/enum/transaction-state.enum').TransactionState;
      type: import('$/common/enum/transaction-type.enum').TransactionType;
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
        state: import('$/common/enum/transaction-state.enum').TransactionState;
        type: import('$/common/enum/transaction-type.enum').TransactionType;
        walletUuid: Uuid;
      }): Promise<Api.Entities.Transaction>;
      findByUuid(data: {
        transactionUuid: Uuid;
        userUuid: Uuid;
      }): Promise<Api.Entities.Transaction | undefined>;
      findByUuidOrFail(data: {
        transactionUuid: Uuid;
        userUuid: Uuid;
      }): Promise<Api.Entities.Transaction>;
      process(data: {
        balance: number;
        transactionUuid: Uuid;
        walletUuid: Uuid;
      }): Promise<Api.Entities.Transaction>;
      updateState(data: {
        state: import('$/common/enum/transaction-state.enum').TransactionState;
        transactionUuid: Uuid;
      }): Promise<Api.Repositories.Responses.UpdateResult>;
    };

    type User = {
      create(data: {
        email: Email;
        password: string;
        wallet: { balance: number; name: string };
      }): Promise<Api.Entities.User>;
      delete(data: { userUuid: Uuid }): Promise<Api.Repositories.Responses.DeleteResult>;
      findByUuid(data: { userUuid: Uuid }): Promise<Api.Entities.User | undefined>;
      findByUuidOrFail(data: { userUuid: Uuid }): Promise<Api.Entities.User>;
      findByValidCredentials(data: {
        email: Email;
        password: string;
      }): Promise<Api.Entities.User | undefined>;
    };

    type Wallet = {
      create(data: { userUuid: Uuid; name: string }): Promise<Api.Entities.Wallet>;
      findByUuid(data: {
        userUuid: Uuid;
        walletUuid: Uuid;
      }): Promise<Api.Entities.Wallet | undefined>;
      findByUuidOrFail(data: { userUuid: Uuid; walletUuid: Uuid }): Promise<Api.Entities.Wallet>;
    };
  }
}
