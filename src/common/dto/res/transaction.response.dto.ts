import { ApiProperty } from '@nestjs/swagger';

import { TransactionState } from '$/common/enum/transaction-state.enum';
import { TransactionType } from '$/common/enum/transaction-type.enum';

export class TransactionResponse {
  @ApiProperty({
    description: "The transaction's unique id.",
    example: '343c6ac5-2b72-4c41-a9eb-28f5ae49af80',
    nullable: false,
    required: true,
    type: String,
  })
  readonly id: Uuid;

  @ApiProperty({
    description: 'The transaction amount.',
    example: 100,
    nullable: false,
    required: true,
    type: Number,
  })
  readonly amount: number;

  @ApiProperty({
    description: 'The transaction reference.',
    example: 'Payed Alice',
    nullable: false,
    required: true,
    type: String,
  })
  readonly reference: string;

  @ApiProperty({
    description: 'The state of the transaction.',
    example: TransactionState.Processed,
    enum: TransactionState,
    nullable: false,
    required: true,
    type: String,
  })
  readonly state: TransactionState;

  @ApiProperty({
    description: 'The type of transaction.',
    example: TransactionType.Credit,
    enum: TransactionType,
    nullable: false,
    required: true,
    type: String,
  })
  readonly type: TransactionType;

  @ApiProperty({
    description: 'The date the transaction was created.',
    example: '2022-01-26T10:49:53.129Z',
    nullable: false,
    required: true,
    type: String,
  })
  readonly createdAt: string;

  @ApiProperty({
    description: 'The date the transaction was updated.',
    example: '2022-01-26T10:49:53.129Z',
    nullable: true,
    required: false,
    type: String,
  })
  readonly updatedAt: Nullable<string>;

  constructor(data: {
    uuid: Uuid;
    amount: number;
    reference: string;
    state: TransactionState;
    type: TransactionType;
    createdAt: Date;
    updatedAt?: Date;
  }) {
    this.id = data.uuid;
    this.amount = data.amount;
    this.reference = data.reference;
    this.state = data.state;
    this.type = data.type;
    this.createdAt = data.createdAt.toISOString();
    this.updatedAt = data.updatedAt
      ? /* istanbul ignore next */ data.updatedAt.toISOString()
      : null;
  }
}
