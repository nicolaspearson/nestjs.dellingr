import { ApiProperty } from '@nestjs/swagger';

export class JwtResponse {
  @ApiProperty({
    description: 'The jwt token.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMzQzYzZhYzUtMmI3Mi00YzQxLWE5ZWItMjhmNWFlNDlhZjgwIiwiaWF0IjoxNjM4MDkxNjEzLCJleHAiOjE2MzgwOTI1MTMsImlzcyI6InN1cHBvcnRAZ3Jhbml0ZS5jb20iLCJqdGkiOiJiZDZiMzMzZS04NWZkLTQ3YzgtOWMxMy03NDhhNDZjYTE5MmIifQ.jlMl8fFBUdItwkTiQsna74OqwhC6itNxc8IUyU4Imxs',
    nullable: false,
    required: true,
    type: String,
  })
  readonly token: JwtToken;

  constructor(data: { token: JwtToken }) {
    this.token = data.token;
  }
}
