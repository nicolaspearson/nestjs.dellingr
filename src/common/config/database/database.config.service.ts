import path from 'path';

import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '$/common/config/config.service';
import { Environment } from '$/common/enum/environment.enum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassReference = new (...args: any[]) => any;
type RequiredReference = { [key: string]: ClassReference };
export type WebpackDataSourceOptions = Pick<TypeOrmModuleOptions, 'entities' | 'migrations'>;

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const { database: databaseConfig, nodeEnv } = this.configService;
    const {
      credentials,
      dropSchema,
      entities,
      logging,
      migrations,
      migrationsRun,
      synchronize,
      type,
      useWebpack,
    } = databaseConfig;
    const { database, schema, host, port, password, username } = credentials;

    // Configure the base data source options.
    const options = {
      database,
      schema,
      host,
      port,
      password,
      username,
      type,

      // Entities
      entities: [path.resolve(entities[0])],

      // Logging
      logging,

      // Migrations
      migrationsRun,
      migrationsTransactionMode: 'all',
      migrations: [path.resolve(migrations[0])],

      // Synchronization
      dropSchema: nodeEnv === Environment.Production ? false : dropSchema,
      synchronize: nodeEnv === Environment.Production ? false : synchronize,
    } as TypeOrmModuleOptions;

    // This option should always be set to false in the integration tests.
    if (useWebpack === true) {
      Object.assign(options, {
        entities: this.entityFunctions(),
        migrations: this.migrationFunctions(),
      });
    }

    return options;
  }

  /**
   * This required because we supply TypeORM with our entities and migrations on start-up. This can
   * either be supplied as a path to a location where TypeORM is able to locate the compiled classes
   * and functions, e.g. dist/db/entities/*.js, or we can supply the entities one-by-one in the
   * data source configuration, both options have their downsides. It is not ideal to supply a path
   * because we are compiling a single bundle, and we do not want to supply each entity and migration
   * in the data source configuration because this soon becomes unmanageable as the size of the package
   * grows.
   *
   * Webpack gives us require.context, which allows us to get all matching modules from a given
   * directory. This means we can get all of our entities and migrations automatically, and supply
   * this to TypeORM in the data source configuration instead.
   *
   * https://spin.atomicobject.com/2020/12/21/typeorm-webpack/
   * https://webpack.js.org/guides/dependency-management/#requirecontext
   */
  private importFunctions(requireContext: __WebpackModuleApi.RequireContext): ClassReference[] {
    return requireContext
      .keys()
      .sort()
      .flatMap((filename) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const required: RequiredReference = requireContext(filename);
        const result: ClassReference[] = [];
        for (const exportedKey of Object.keys(required)) {
          const exported = required[exportedKey];
          if (typeof exported === 'function') {
            result.push(exported);
          }
        }
        return result;
      });
  }

  private entityFunctions(): NonNullable<WebpackDataSourceOptions['entities']> {
    // eslint-disable-next-line unicorn/prefer-module
    return this.importFunctions(require.context('../../../db/entities/', true, /\.ts$/));
  }

  private migrationFunctions(): NonNullable<WebpackDataSourceOptions['migrations']> {
    // eslint-disable-next-line unicorn/prefer-module
    return this.importFunctions(require.context('../../../db/migrations/', true, /\.ts$/));
  }
}
