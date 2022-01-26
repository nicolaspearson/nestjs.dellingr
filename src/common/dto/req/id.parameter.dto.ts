import { IsNotEmpty, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class IdParameter {
  @ApiProperty({
    description: 'The id of the resource',
    example: 'c6bc6249-74e4-4f0c-b9b1-690b545c97c9',
    required: true,
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  readonly id!: Uuid;
}
