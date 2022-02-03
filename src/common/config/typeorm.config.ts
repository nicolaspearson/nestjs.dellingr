import { oneLineTrim } from 'common-tags';
import { ConnectionOptions } from 'typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import * as webpackConfig from '$/common/config/typeorm-webpack.config';
import { Environment } from '$/common/enum/environment.enum';

type MergedConnectionOptions = TypeOrmModuleOptions &
  ConnectionOptions &
  Partial<PostgresConnectionCredentialsOptions>;

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger: Logger = new Logger(TypeOrmConfigService.name);

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const connectionOptions = TypeOrmConfigService.creatConnectionOptions();
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
  static creatConnectionOptions(): MergedConnectionOptions {
    const type = process.env.TYPEORM_CONNECTION as 'postgres';
    const connectionOptions: MergedConnectionOptions = {
      type,
      host: process.env.TYPEORM_HOST,
      port: Number(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      schema: process.env.TYPEORM_SCHEMA,
      synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
      dropSchema: process.env.TYPEORM_DROP_SCHEMA === 'true',
      entities: [process.env.TYPEORM_ENTITIES as string],
      migrations: [process.env.TYPEORM_MIGRATIONS as string],
      keepConnectionAlive: false,
    };

    // This option should always be set to false in the integration tests.
    if (process.env.TYPEORM_USE_WEBPACK === 'true') {
      Object.assign(connectionOptions, {
        entities: webpackConfig.entityFunctions(),
        migrations: webpackConfig.migrationFunctions(),
      } as ConnectionOptions);
    }

    if (process.env.NODE_ENV === Environment.Production) {
      // Production options that will override anything considered 'unsafe'
      const productionOptions: MergedConnectionOptions = {
        dropSchema: false, // Never drop the database schema in production
        logging: ['schema', 'error'],
        migrationsRun: true, // Run migrations automatically on each application launch
        synchronize: false, // Never synchronize database entities in production
        type,
      };
      Object.assign(connectionOptions, productionOptions);
    } else {
      // Development options that will always keep the connection alive.
      const developmentOptions: MergedConnectionOptions = {
        keepConnectionAlive: true, // This allows HMR to work seamlessly
        logging: ['error', 'schema', 'warn'],
        type,
      };
      Object.assign(connectionOptions, developmentOptions);
    }

    return connectionOptions;
  }
}
