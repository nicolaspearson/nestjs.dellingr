import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

import { LogLevel } from '@nestjs/common';

import { ApiConfig } from '$/common/config/api/api.config';
import { AwsConfig } from '$/common/config/aws/aws.config';
import { DatabaseConfig } from '$/common/config/database/database.config';
import { JwtConfig } from '$/common/config/jwt/jwt.config';
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
  @ValidateNested()
  @Type(() => ApiConfig)
  @IsNotEmptyObject()
  readonly api!: ApiConfig;

  @ValidateNested()
  @Type(() => AwsConfig)
  @IsNotEmptyObject()
  readonly aws!: AwsConfig;

  @ValidateNested()
  @Type(() => DatabaseConfig)
  @IsNotEmptyObject()
  readonly database!: DatabaseConfig;

  // The deployment environment
  @IsEnum(Environment)
  @IsNotEmpty()
  readonly environment!: Environment;

  @ValidateNested()
  @Type(() => JwtConfig)
  @IsNotEmptyObject()
  readonly jwt!: JwtConfig;

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
