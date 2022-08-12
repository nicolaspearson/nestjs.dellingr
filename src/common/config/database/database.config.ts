import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LoggerOptions } from 'typeorm';
import { BaseDataSourceOptions } from 'typeorm/data-source/BaseDataSourceOptions';

import { PostgresCredentialsConfig } from '$/common/config/database/postgres-credentials.config';
import { ParseBoolean } from '$/common/decorators/parse-boolean.decorator';

export class DatabaseConfig implements BaseDataSourceOptions {
  @ValidateNested()
  @Type(() => PostgresCredentialsConfig)
  @IsNotEmptyObject()
  readonly credentials!: PostgresCredentialsConfig;

  // Drops the schema each time connection is being established.
  @ParseBoolean()
  @IsBoolean()
  readonly dropSchema: boolean = false;

  // Entities to be loaded and used by the data source.
  @IsString({ each: true })
  @Transform(/* istanbul ignore next */ ({ value }: { value: string }) => [value])
  readonly entities: string[] = ['src/db/entities/*.ts'];

  // Entities to be loaded and used by the data source.
  @IsString({ each: true })
  @Transform(/* istanbul ignore next */ ({ value }: { value: string }) => value.split(','))
  readonly logging: LoggerOptions = [];

  // Executes pending migrations if set to true.
  @ParseBoolean()
  @IsBoolean()
  readonly migrationsRun: boolean = true;

  // Migrations to be loaded and used by the data source.
  @IsString({ each: true })
  @Transform(/* istanbul ignore next */ ({ value }: { value: string }) => [value])
  readonly migrations: string[] = ['src/db/migrations/*.ts'];

  // If set to true the database schema will be synchronized (should always be false in production!)
  @ParseBoolean()
  @IsBoolean()
  readonly synchronize: boolean = false;

  // The database engine.
  @IsIn(['postgres'])
  @IsNotEmpty()
  readonly type = 'postgres' as const;

  // Should be to true if the application is being bundled with webpack.
  @ParseBoolean()
  @IsBoolean()
  readonly useWebpack: boolean = true;
}
