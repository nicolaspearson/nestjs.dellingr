type Nullable<T> = T | null;
type Opaque<K, T> = T & { type: K };

type Email = Opaque<'Email', string>;
type Uuid = Opaque<'Uuid', string>;

declare namespace Api {
  interface Error {
    code: number;
    errors?: string[] | Record<string, unknown>[];
    message: string;
    name: string;
  }
}
