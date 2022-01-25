import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorName } from '$/common/enum/error-name.enum';

import { BaseError } from './base.error';

const DEFAULT_MESSAGE =
  'The server could not understand the request due to invalid syntax / arguments.';

export class BadRequestError extends BaseError {
  @ApiProperty({
    description: 'The HTTP response code.',
    example: HttpStatus.BAD_REQUEST,
  })
  declare readonly code: number;

  @ApiProperty({
    description: 'An array of error details.',
    example: [],
    isArray: true,
    type: Object,
  })
  declare readonly errors: string[] | Record<string, unknown>[];

  @ApiProperty({
    description: 'The error message.',
    example: DEFAULT_MESSAGE,
  })
  declare readonly message: string;

  @ApiProperty({
    description: 'The name of the error.',
    example: ErrorName.BadRequest,
  })
  declare readonly name: string;

  constructor(message?: string, errors?: string[] | Record<string, unknown>[]) {
    super({
      code: HttpStatus.BAD_REQUEST,
      errors,
      message: message || DEFAULT_MESSAGE,
      name: ErrorName.BadRequest,
    });
  }
}
