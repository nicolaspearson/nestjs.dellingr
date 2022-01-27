import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletRequest {
  @ApiProperty({
    description: 'The name of the wallet',
    example: 'Secondary',
    required: true,
    nullable: false,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;
}
