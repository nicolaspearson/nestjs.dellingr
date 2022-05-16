import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Algorithm } from 'jsonwebtoken';

import { LogLevel } from '@nestjs/common';

import { DatabaseConfig } from '$/common/config/database/database.config';
import { ParseBoolean } from '$/common/decorators/parse-boolean.decorator';
import { Environment } from '$/common/enum/environment.enum';

/**
 * This ConfigService is injected globally by the
 * `TypedConfigModule`: https://github.com/Nikaple/nest-typed-config
 *
 * It can be imported into any provider as follows:
 *
 * @example
 *
 * constructor(private readonly configService: ConfigService) {}
 */
export class ConfigService {
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

  @ValidateNested()
  @Type(() => DatabaseConfig)
  @IsNotEmptyObject()
  readonly database!: DatabaseConfig;

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

  // If set to true, the environment will be seeded with database fixtures, and default S3 buckets (should always be false in production!)
  @ParseBoolean()
  @IsBoolean()
  readonly seedEnvironment: boolean = false;
}
