import { IsEmail, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { IsValidPassword } from '$/common/validators/is-valid-password.validator';
import { DEFAULT_PASSWORD } from '$/db/fixtures/user.fixture';

export class UserRegistrationRequest {
  @ApiProperty({
    description: "The user's email address.",
    example: 'john.doe@example.com',
    required: true,
    type: String,
  })
  @IsEmail()
  @IsNotEmpty()
  readonly email!: Email;

  @ApiProperty({
    description: "The user's password.",
    example: DEFAULT_PASSWORD,
    required: true,
    type: String,
  })
  @IsValidPassword()
  @IsNotEmpty()
  readonly password!: string;
}
