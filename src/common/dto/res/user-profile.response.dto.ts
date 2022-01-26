import { ApiProperty } from '@nestjs/swagger';

import { WalletResponse } from './wallet.response.dto';

export class UserProfileResponse {
  @ApiProperty({
    description: "The user's unique id.",
    example: '343c6ac5-2b72-4c41-a9eb-28f5ae49af80',
    nullable: false,
    required: true,
    type: String,
  })
  readonly id: Uuid;

  @ApiProperty({
    description: "The user's email address.",
    example: 'john.doe@example.com',
    nullable: false,
    required: true,
    type: String,
  })
  readonly email: Email;

  @ApiProperty({
    description: 'The list of wallets that belong to the user.',
    isArray: true,
    required: true,
    type: /* istanbul ignore next */ () => WalletResponse,
  })
  readonly wallets: WalletResponse[];

  constructor(data: { uuid: Uuid; email: Email; wallets: Api.Entities.Wallet[] }) {
    this.id = data.uuid;
    this.email = data.email;
    this.wallets = data.wallets.map((w) => new WalletResponse(w));
  }
}
