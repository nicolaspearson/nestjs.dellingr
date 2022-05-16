import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class ApiConfig {
  @IsString()
  readonly host: string = 'localhost';

  @Type(() => Number)
  @IsNumber()
  readonly port: number = 3000;
}
