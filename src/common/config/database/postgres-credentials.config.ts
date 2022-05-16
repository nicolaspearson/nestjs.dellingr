import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions';

export class PostgresCredentialsConfig implements PostgresConnectionCredentialsOptions {
  // The database name.
  @IsString()
  @IsNotEmpty()
  readonly database!: string;

  // The database schema name.
  @IsString()
  readonly schema: string = 'public';

  // The database host.
  @IsString()
  @IsNotEmpty()
  readonly host!: string;

  // The database port.
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  readonly port!: number;

  // The password of the database user.
  @IsString()
  @IsNotEmpty()
  readonly password!: string;

  // The username of the database user.
  @IsString()
  @IsNotEmpty()
  readonly username!: string;
}
