import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Algorithm } from 'jsonwebtoken';

import { LogLevel } from '@nestjs/common';

import { Environment } from '$/common/enum/environment.enum';

export class Config {
  @IsString()
  readonly apiHost: string = 'localhost';

  @Type(() => Number)
  @IsNumber()
  readonly apiPort: number = 3000;

  @IsString()
  @IsNotEmpty()
  readonly awsAccessKeyId!: string;

  // The optional AWS endpoint (should only used locally)
  @IsString()
  @IsOptional()
  readonly awsEndpoint?: string;

  @IsString()
  @IsNotEmpty()
  readonly awsRegion!: string;

  @IsString()
  @IsNotEmpty()
  readonly awsSecretAccessKey!: string;

  // The name of the AWS S3 bucket where uploaded `documents` are stored
  @IsString()
  @IsNotEmpty()
  readonly awsS3BucketName!: string;

  // The deployment environment
  @IsEnum(Environment)
  @IsNotEmpty()
  readonly environment!: Environment;

  @IsIn(['HS256'])
  readonly jwtAlgorithm: Algorithm = 'HS256';

  @IsString()
  readonly jwtIssuer: string = 'support@granite.com';

  @IsString()
  @IsNotEmpty()
  readonly jwtSecret!: string;

  @Matches(/^\d+[dhms]$/)
  readonly jwtTokenExpiration: Api.ExpirationTime = '15m' as Api.ExpirationTime;

  @IsIn(['verbose', 'debug', 'log', 'warn', 'error'])
  readonly logLevel: LogLevel = 'error';

  // The node runtime environment
  @IsIn([Environment.Development, Environment.Production])
  readonly nodeEnv: Environment.Development | Environment.Production = Environment.Development;

  // If set to true, the environment will be seed with database fixtures, and default S3 buckets
  @Type(() => Boolean)
  @IsBoolean()
  readonly seedEnvironment: boolean = false;

  // The database vendor, e.g. MySQL, PostgreSQL, etc.
  @IsIn(['postgres'])
  readonly typeormConnection: string = 'postgres';

  // The name of the database
  @IsString()
  @IsNotEmpty()
  readonly typeormDatabase!: string;

  // TypeORM will drop existing schemas if set to true
  @Type(() => Boolean)
  @IsBoolean()
  readonly typeormDropSchema: boolean = false;

  // The path to the TypeORM entities
  @IsString()
  readonly typeormEntities: string = 'src/db/entities/*.ts';

  @IsString()
  @IsNotEmpty()
  readonly typeormHost!: string;

  // The path to the TypeORM migrations directory
  @IsString()
  readonly typeormMigrationsDir: string = 'src/db/migrations';

  @Type(() => Boolean)
  @IsBoolean()
  readonly typeormMigrationsRun: boolean = true;

  // The path to the TypeORM migrations
  @IsString()
  readonly typeormMigrations: string = 'src/db/migrations/*.ts';

  @IsString()
  @IsNotEmpty()
  readonly typeormPassword!: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly typeormPort!: string;

  // The name of the database schema
  @IsString()
  @IsNotEmpty()
  readonly typeormSchema!: string;

  // If set to true the database schema will be synchronized (should always be false in production!)
  @Type(() => Boolean)
  @IsBoolean()
  readonly typeormSynchronize: boolean = false;

  @IsString()
  @IsNotEmpty()
  readonly typeormUsername!: string;

  // Should be to true if the application is being bundled with webpack
  @Type(() => Boolean)
  @IsBoolean()
  readonly typeormUseWebpack: boolean = true;
}
