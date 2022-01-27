import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { TransactionType } from '$/common/enum/transaction-type.enum';

export class CreateTransactionRequest {
  @ApiProperty({
    description: 'The transaction amount.',
    example: 100,
    nullable: false,
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  @IsNumber()
  readonly amount!: number;

  @ApiProperty({
    description: 'The transaction reference.',
    example: 'Payed Alice',
    nullable: false,
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly reference!: string;

  @ApiProperty({
    description: 'The type of transaction.',
    example: TransactionType.Credit,
    enum: TransactionType,
    nullable: false,
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  readonly type!: TransactionType;

  @ApiProperty({
    description: 'The unique id of the wallet.',
    example: '343c6ac5-2b72-4c41-a9eb-28f5ae49af80',
    required: true,
    nullable: false,
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  readonly walletId!: Uuid;
}
