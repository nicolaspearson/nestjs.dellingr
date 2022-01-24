import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponse {
  @ApiProperty({
    description: 'The health status of the API.',
    example: 'OK',
    nullable: false,
    required: true,
    type: String,
  })
  readonly status: string;

  constructor(data: { status: string }) {
    this.status = data.status;
  }
}
