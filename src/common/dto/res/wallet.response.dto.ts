import { ApiProperty } from '@nestjs/swagger';

import { TransactionResponse } from './transaction.response.dto';

export class WalletResponse {
  @ApiProperty({
    description: "The user's unique id.",
    example: '343c6ac5-2b72-4c41-a9eb-28f5ae49af80',
    nullable: false,
    required: true,
    type: String,
  })
  readonly id: Uuid;

  @ApiProperty({
    description: 'The wallet balance.',
    example: 1000,
    nullable: false,
    required: true,
    type: Number,
  })
  readonly balance: number;

  @ApiProperty({
    description: 'The name of the wallet.',
    example: 'Main',
    nullable: false,
    required: true,
    type: String,
  })
  readonly name: string;

  @ApiProperty({
    description: 'The list of transactions that have occurred on this wallet.',
    isArray: true,
    required: true,
    type: /* istanbul ignore next */ () => TransactionResponse,
  })
  readonly transactions: TransactionResponse[];

  constructor(data: Api.Entities.Wallet) {
    this.id = data.uuid;
    this.balance = data.balance;
    this.name = data.name;
    this.transactions = data.transactions.map((t) => new TransactionResponse(t));
  }
}
