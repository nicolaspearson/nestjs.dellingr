import { ApiProperty } from '@nestjs/swagger';

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

  constructor(data: { uuid: Uuid; email: Email }) {
    this.id = data.uuid;
    this.email = data.email;
  }
}
