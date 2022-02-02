import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentRequest {
  @ApiProperty({
    description: 'The name of the document',
    example: 'Payment invoice',
    required: true,
    nullable: false,
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  readonly name!: string;

  @ApiProperty({
    description: 'The unique id of the transaction.',
    example: '343c6ac5-2b72-4c41-a9eb-28f5ae49af80',
    required: true,
    nullable: false,
    type: String,
  })
  @IsNotEmpty()
  @IsUUID()
  readonly transactionId!: Uuid;
}
