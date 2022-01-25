import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorName } from '$/common/enum/error-name.enum';

export const DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE =
  "The server has encountered a situation it doesn't know how to handle.";

export class BaseError extends Error {
  @ApiProperty({
    description: 'The HTTP response code.',
    example: HttpStatus.INTERNAL_SERVER_ERROR,
  })
  code: number;

  @ApiProperty({
    description: 'An array of error details.',
    example: [],
    isArray: true,
  })
  errors: string[] | Record<string, unknown>[];

  @ApiProperty({
    description: 'The error message.',
    example: DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE,
  })
  message: string;

  @ApiProperty({
    description: 'The name of the error.',
    example: ErrorName.InternalServerError,
  })
  name: string;

  constructor(error?: Api.Error) {
    super();
    this.code = error?.code || HttpStatus.INTERNAL_SERVER_ERROR;
    this.errors = error?.errors || [];
    this.message = error?.message || DEFAULT_INTERNAL_SERVER_ERROR_MESSAGE;
    this.name = error?.name || ErrorName.InternalServerError;
  }
}
