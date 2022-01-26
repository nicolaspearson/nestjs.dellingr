type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };

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

  export type JwtPayload = {
    uuid: Uuid;
  };

  namespace Entities {
    export type Transaction = {
      uuid: Uuid;
      amount: number;
      reference: string;
      state: import('../../src/common/enum/transaction-state.enum').TransactionState;
      type: import('../../src/common/enum/transaction-type.enum').TransactionType;
      createdAt: Date;
      updatedAt?: Date;
    };

    export type Wallet = {
      uuid: Uuid;
      name: string;
      balance: number;
      transactions: Api.Entities.Transaction[];
    };
  }
}
