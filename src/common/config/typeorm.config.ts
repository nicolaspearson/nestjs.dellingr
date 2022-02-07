import { oneLineTrim } from 'common-tags';
import { ConnectionOptions } from 'typeorm';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

import { Injectable, Logger } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConfigService } from '$/common/config/environment.config';
import * as webpackConfig from '$/common/config/typeorm-webpack.config';
import { Environment } from '$/common/enum/environment.enum';

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
    const type = this.configService.typeormConnection;
    const connectionOptions: MergedConnectionOptions = {
      type,
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
        entities: webpackConfig.entityFunctions(),
        migrations: webpackConfig.migrationFunctions(),
      } as ConnectionOptions);
    }

    if (this.configService.nodeEnv === Environment.Production) {
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
