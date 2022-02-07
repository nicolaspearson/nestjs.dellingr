import { oneLineTrim } from 'common-tags';
import { ConnectionOptions } from 'typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '$/common/config/config.service';
import { Environment } from '$/common/enum/environment.enum';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassReference = new (...args: any[]) => any;
type RequiredReference = { [key: string]: ClassReference };
export type WebpackConnectionOptions = Pick<ConnectionOptions, 'entities' | 'migrations'>;

export type MergedConnectionOptions = TypeOrmModuleOptions &
  ConnectionOptions &
  Partial<PostgresConnectionCredentialsOptions>;

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger: Logger = new Logger(TypeOrmConfigService.name);

  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const connectionOptions = this.creatConnectionOptions();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...optionsWithoutPassword } = connectionOptions;
    this.logger.debug(oneLineTrim`
      TypeORM options: ${JSON.stringify(optionsWithoutPassword)}
    `);
    return connectionOptions;
  }

  /**
   * Creates the connection configuration that will be used by TypeORM.
   *
   * @returns The {@link MergedConnectionOptions} connection options which TypeORM will use.
   */
  creatConnectionOptions(): MergedConnectionOptions {
    // Create the default connection using the supplied config values / environment variables.
    const connectionOptions: MergedConnectionOptions = {
      type: this.configService.typeormConnection,
      host: this.configService.typeormHost,
      port: this.configService.typeormPort,
      username: this.configService.typeormUsername,
      password: this.configService.typeormPassword,
      database: this.configService.typeormDatabase,
      schema: this.configService.typeormSchema,
      synchronize: this.configService.typeormSynchronize,
      dropSchema: this.configService.typeormDropSchema,
      entities: [this.configService.typeormEntities],
      migrations: [this.configService.typeormMigrations],
      keepConnectionAlive: false,
    };

    // This option should always be set to false in the integration tests.
    if (this.configService.typeormUseWebpack === true) {
      Object.assign(connectionOptions, {
        entities: this.entityFunctions(),
        migrations: this.migrationFunctions(),
      } as ConnectionOptions);
    }

    return this.configService.nodeEnv === Environment.Production
      ? // Production options that will override anything considered 'unsafe'
        {
          ...connectionOptions,
          dropSchema: false, // Never drop the database schema in production
          logging: ['schema', 'error'],
          migrationsRun: true, // Run migrations automatically on each application launch
          synchronize: false, // Never synchronize database entities in production
        }
      : {
          ...connectionOptions,
          keepConnectionAlive: true, // This allows HMR to work seamlessly
          logging: ['error', 'schema', 'warn'],
        };
  }

  /**
   * This required because we supply TypeORM with our entities and migrations on start-up. This can
   * either be supplied as a path to a location where TypeORM is able to locate the compiled classes
   * and functions, e.g. dist/db/entities/*.js, or we can supply the entities one-by-one in the
   * connection configuration, both options have their downsides. It is not ideal to supply a path
   * because we are compiling a single bundle, and we do not want to supply each entity and migration
   * in the connection configuration because this soon becomes unmanageable as the size of the package
   * grows.
   *
   * Webpack gives us require.context, which allows us to get all matching modules from a given
   * directory. This means we can get all of our entities and migrations automatically, and supply
   * this to TypeORM in the connection configuration instead.
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

  private entityFunctions(): NonNullable<WebpackConnectionOptions['entities']> {
    // eslint-disable-next-line unicorn/prefer-module
    return this.importFunctions(require.context('../../db/entities/', true, /\.ts$/));
  }

  private migrationFunctions(): NonNullable<WebpackConnectionOptions['migrations']> {
    // eslint-disable-next-line unicorn/prefer-module
    return this.importFunctions(require.context('../../db/migrations/', true, /\.ts$/));
  }
}
