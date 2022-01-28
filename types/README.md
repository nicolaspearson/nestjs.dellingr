# Types

[TypeScript Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
that all packages / classes can use without explicitly importing them.

Declaration files should follow the [Do's and Don'ts](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
defined in TypeScript's documentation.

## API

The `api` directory contains types that are used in the source code.

## Generated

The `generated` directory contains types that are generated from the `Request` and `Response` dto's.
This assists consumers, i.e. frontend applications that require a type-safe definition of the `api`.

The types can be re-generated via `yarn dts:generate`.
