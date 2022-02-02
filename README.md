# Dellingr

A simple [NestJS](https://github.com/nestjs/nest) starter repository built using TypeScript.

## Getting Started

### Installation

```bash
yarn install
```

### Building, Running, and Testing the Application

```bash
# Build the application
yarn build

# Lint the application
yarn lint

# Start the application in dev mode
yarn start:dev

# Execute the unit tests for the application
yarn test:unit

# Execute the integration tests for the application
yarn test:integration
```

The project can also be built and started using docker:

> Note: Using docker will start the application in production mode, which excludes database
> fixtures.

```bash
# Build the application using docker
yarn docker:build

# Build and start the application using docker
yarn docker:start

# Attach to the docker logs for the application
yarn docker:logs
```

### Swagger

Swagger documentation is served on [localhost](http://localhost:3000/docs/dellingr/). Requests
can be executed directly from the Swagger user interface. The example documentation contains valid
fixtures that are automatically populated on application start-up.

### Database

This package uses TypeORM and PostgreSQL.

![ER Diagram](./assets/er-diagram.png)

#### Scripts

| script                        | description                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------- |
| db:logs                       | Shows the docker logs of the running PostgreSQL instance.                         |
| db:migration:create           | Creates an empty migration.                                                       |
| db:migration:generate         | Generates a new migration.                                                        |
| db:migration:generate:missing | Generates a new migration by creating a diff.                                     |
| db:seed                       | Seeds the database with predefined fixtures.                                      |
| db:start                      | Starts a PostgreSQL instance in a docker container.                               |
| db:stop                       | Stops and destroys an existing PostgreSQL instance running in a docker container. |

#### Migrations

To generate the missing migrations TypeORM applies existing migrations, and uses the diff between
the database schema and the TypeORM entities to create a migration file.

```sh
# Replace <migration-name> with a descriptive name for the generated migration
yarn db:migration:generate:missing <migration-name>
```

## Structure

The section provides insight into how the project has been structured.

### Source Code

The source code directory has been structured in a very flat manner, all directories are `modules`
except for the `common` and `db` directories.

- The `common` directory contains everything that is
  not a module. These classes may be re-used throughout the application without any restrictions.
- The `db` directory encapsulates all database related functionality (more on this below).
- Each `module` consists of a presentation layer in the form of an HTTP `controller`, and domain /
  business logic that has been wrapped in a `service` not all `modules` need to provide a
  `controller`, e.g. the `token` module only has a `service` implementation that is imported by
  other application `modules`.

```sh
src
├── app
│   └── app.module.ts
├── auth
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── common
│   ├── config
│   │   ├── environment.config.ts
│   │   ├── helmet.config.ts
│   │   ├── typeorm-webpack.config.ts
│   │   └── typeorm.config.ts
│   ├── constants
│   │   └── index.ts
│   ├── dto
│   │   ├── index.ts
│   │   ├── req
│   │   │   ├── create-transaction.request.dto.ts
│   │   │   ├── create-wallet.request.dto.ts
│   │   │   ├── id.parameter.dto.ts
│   │   │   ├── login.request.dto.ts
│   │   │   └── user-registration.request.dto.ts
│   │   └── res
│   │       ├── health-check.response.dto.ts
│   │       ├── jwt.response.dto.ts
│   │       ├── transaction.response.dto.ts
│   │       ├── user-profile.response.dto.ts
│   │       └── wallet.response.dto.ts
│   ├── enum
│   │   ├── api-group.enum.ts
│   │   ├── environment.enum.ts
│   │   ├── error-name.enum.ts
│   │   ├── transaction-state.enum.ts
│   │   └── transaction-type.enum.ts
│   ├── error
│   │   ├── bad-request.error.ts
│   │   ├── base.error.ts
│   │   ├── conflict.error.ts
│   │   ├── index.ts
│   │   ├── internal-server.error.ts
│   │   ├── not-found.error.ts
│   │   ├── request-timeout.error.ts
│   │   ├── unauthorized.error.ts
│   │   └── unprocessable-entity.error.ts
│   ├── filters
│   │   └── error.filter.ts
│   ├── guards
│   │   └── jwt-auth.guard.ts
│   ├── pipes
│   │   └── dto-validation.pipe.ts
│   ├── swagger
│   │   ├── dts-exporter.swagger.ts
│   │   └── dts-generator.swagger.ts
│   └── validators
│       └── is-valid-password.validator.ts
├── db
│   ├── database.module.ts
│   ├── entities
│   │   ├── transaction.entity.ts
│   │   ├── user.entity.ts
│   │   └── wallet.entity.ts
│   ├── fixtures
│   │   ├── transaction.fixture.ts
│   │   ├── user.fixture.ts
│   │   └── wallet.fixture.ts
│   ├── interceptors
│   │   └── database-transaction.interceptor.ts
│   ├── migrations
│   │   ├── 1643121437236-initial.ts
│   │   └── 1643790225628-update-constraints.ts
│   ├── repositories
│   │   ├── index.ts
│   │   ├── transaction.repository.ts
│   │   ├── user.repository.ts
│   │   └── wallet.repository.ts
│   ├── services
│   │   └── database-transaction.service.ts
│   └── utils
│       ├── seed.util.ts
│       └── user.util.ts
├── health
│   ├── health.controller.ts
│   └── health.module.ts
├── main.module.ts
├── main.ts
├── token
│   ├── token.module.ts
│   └── token.service.ts
├── transaction
│   ├── transaction.controller.ts
│   ├── transaction.module.ts
│   └── transaction.service.ts
├── user
│   ├── user.controller.ts
│   ├── user.module.ts
│   └── user.service.ts
└── wallet
    ├── wallet.controller.ts
    ├── wallet.module.ts
    └── wallet.service.ts
```

### Repositories

This project uses the [`unit-of-work`](https://martinfowler.com/eaaCatalog/unitOfWork.html)
pattern ([implementation reference](https://github.com/LuanMaik/nestjs-unit-of-work)) in order to
handle database transactions in all database repositories:

The `DatabaseTransactionService` uses
[`AsyncLocalStorage`](https://nodejs.org/api/async_context.html#class-asynclocalstorage) to store an
instance of the TypeORM `EntityManager` used by the database transaction for each HTTP request. This
avoids the need to create a new instance of the `controller`, `service`, and `repository` for every
HTTP request that the application receives.

An HTTP request may be wrapped in a transaction in one of the following two ways:

1. Using the interceptor:

   ```typescript
   // Uses an interceptor to wrap the HTTP request in a database transaction.
   @UseInterceptors(DatabaseTransactionInterceptor)
   async register(@Body() dto: UserRegistrationRequest): Promise<void> {
    try {
      await this.userService.register(dto.email, dto.password);
    } catch (error) {
      // Ignore conflict errors to avoid user enumeration attacks.
      if (!(error instanceof ConflictError)) {
        throw error;
      }
    }
   }
   ```

   - Pros:
     - The usage of decorators and interceptors makes the usage, implementation and maintenance of
       database transactions really straight forward.
   - Cons:
     - More complex / special use cases as can be seen below require a different approach, due to
       the fact that throwing an exception from a function that is wrapped in a database transaction
       should ALWAYS rollback the transaction.
     - Async Local Storage (ALS) can be considered to be request-scoped global state, and generally
       [global variables are considered to be bad.](https://wiki.c2.com/?GlobalVariablesAreBad)
     - Testing and debugging becomes much more challenging.

2. Using an instance of the `DatabaseTransactionService`:

   > Note: This project has a database entity named `transaction` which represents a financial
   > transaction in the use-case. This should not be confused with a database transaction.

   ```typescript
   async create(
    @Req() req: Request,
    @Body() dto: CreateTransactionRequest,
   ): Promise<TransactionResponse> {
     // Wrapped in a database transaction
    const transaction = await this.databaseTransactionService.execute(() =>
        this.transactionService.create(req.userUuid!, dto),
    );
    // Ideally this business logic should not reside in the controller, however
    // due to the fact that the function call above is wrapped in a transaction
    // throwing from the function will cause the transaction to be rolled back.
    if (transaction.state === TransactionState.Rejected) {
      throw new BadRequestError('Insufficient funds');
    }
    return new TransactionResponse(transaction);
   }
   ```

   - Pros:
     - Datbase transactions can be exectuted on individual service functions.
   - Cons:
     - It is not ideal to have business logic in the presentation layer, although in this case the
       business logic is tightly coupled to the transport protocol, i.e. throwing an HTTP exception
       vs throw a gRPC error.

#### References

- [Martin Fowler: Unit Of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html)
- [Per-Request Database Transactions with NestJS and TypeORM](https://aaronboman.com/programming/2020/05/15/per-request-database-transactions-with-nestjs-and-typeorm/)
- [Nest.js Unit Of Work](https://github.com/LuanMaik/nestjs-unit-of-work)
- [Nest.js Interceptors](https://progressivecoder.com/nestjs-interceptors-and-how-to-use-them-learn-nestjs-series-part-8/)
- [Async Local Storage](https://nodejs.org/api/async_context.html#class-asynclocalstorage)
- [The Most Convenient Ways of Writing Transactions Within the Nest.js + TypeORM Stack](https://hackernoon.com/the-most-convenient-ways-of-writing-transactions-within-the-nestjs-typeorm-stack-3q3q33jd)

### Testing

The tests are divided into `integration` and `unit` tests. The `unit` test directory mimics the
layout of the source code. The `integration` test directory has a flat structure and is only
concerned with performing end-to-end tests on exposed endpoints.

The `utils` directory contains test helper functions, `fixtures`, and `mocks`.

```sh
test
├── integration
│   ├── jest.config.js
│   ├── setup.ts
│   └── specs
│       ├── auth.module.spec.ts
│       ├── health.module.spec.ts
│       ├── transaction.module.spec.ts
│       ├── user.module.spec.ts
│       └── wallet.module.spec.ts
├── unit
│   ├── jest.config.js
│   ├── setup.ts
│   └── specs
│       ├── auth
│       │   ├── auth.controller.spec.ts
│       │   └── auth.service.spec.ts
│       ├── common
│       │   ├── config
│       │   │   └── helmet.config.spec.ts
│       │   ├── filters
│       │   │   └── error.filter.spec.ts
│       │   ├── guards
│       │   │   └── jwt-auth.guard.spec.ts
│       │   ├── pipes
│       │   │   └── dto-validation.pipe.spec.ts
│       │   └── validators
│       │       └── is-valid-password.validator.spec.ts
│       ├── health
│       │   └── health.controller.spec.ts
│       ├── token
│       │   └── token.service.spec.ts
│       ├── transaction
│       │   ├── transaction.controller.spec.ts
│       │   └── transaction.service.spec.ts
│       ├── user
│       │   ├── user.controller.spec.ts
│       │   └── user.service.spec.ts
│       └── wallet
│           ├── wallet.controller.spec.ts
│           └── wallet.service.spec.ts
└── utils
    ├── fixtures
    │   └── index.ts
    ├── integration
    │   ├── auth.util.ts
    │   ├── no-output.logger.ts
    │   └── setup-application.ts
    └── mocks
        ├── repo.mock.ts
        └── service.mock.ts
```

## Tech Stack

This repository uses:

- [`docker`](https://www.docker.com/products/docker-desktop)
- [`expressjs`](https://expressjs.com)
- [`nestjs`](https://nestjs.com)
- [`typescript`](https://www.typescriptlang.org)
- [`webpack`](https://webpack.js.org/)
- [`yarn2`](https://yarnpkg.com)

### Configuration Files

- `.dockerignore`: ignores the listed files and directories when using the docker COPY command.
- `.eslintignore`: ignores the listed files and directories when running ESLint.
- `.eslintrc.js`: defines the global ESLint configuration.
- `.pnp.cjs`: automatically generated by Yarn2.
- `.prettierignore`: ignores the listed files and directories when running Prettier.
- `.prettierrc`: defines the global Prettier configuration.
- `.yarnrc.yml`: yarn2 configuration.
  - [fix dependencies with package extensions](https://yarnpkg.com/getting-started/migration#fix-dependencies-with-packageextensions)
- `docker-compose.yaml`: defines docker image for local testing
- `jest.config.js`: defines the global Jest configuration which is inherited by each test suite.
- `tsconfig.json`: defines the global TypeScript configuration.
- `webpack-dts.config.js`: defines the type generation configuration used by webpack.
- `webpack-hmr.config.js`: defines the hot module replacement configuration used by webpack.
- `webpack.config.js`: defines the production configuration used by webpack.
- `webpack.util.js`: defines the global Webpack configuration used by each sub `webpack` config.

### Development Tools

- **commitlint**: Enforces the [conventional commit](https://www.conventionalcommits.org/) style.
- **eslint**: JavaScript and TypeScript linter.
- **husky**: Commit hooks that run commitlint, yarn and prettier to ensure quality before pushing.
- **prettier**: Code auto formatter.
- **yarn2**: The preferred package manager.
- **webpack**: The preferred application bundler.
