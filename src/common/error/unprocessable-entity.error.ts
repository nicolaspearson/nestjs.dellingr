import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorName } from '$/common/enum/error-name.enum';

import { BaseError } from './base.error';

const DEFAULT_MESSAGE = 'The provided entity could not be processed.';

export class UnprocessableEntityError extends BaseError {
  @ApiProperty({
    description: 'The HTTP response code.',
    example: HttpStatus.UNPROCESSABLE_ENTITY,
  })
  declare readonly code: number;

  @ApiProperty({
    description: 'An array of error details.',
    example: [],
    isArray: true,
  })
  declare readonly errors: string[] | Record<string, unknown>[];

  @ApiProperty({
    description: 'The error message.',
    example: DEFAULT_MESSAGE,
  })
  declare readonly message: string;

  @ApiProperty({
    description: 'The name of the error.',
    example: ErrorName.UnprocessableEntity,
  })
  declare readonly name: string;

  constructor(message?: string, errors?: string[] | Record<string, unknown>[]) {
    super({
      code: HttpStatus.UNPROCESSABLE_ENTITY,
      errors,
      message: message || DEFAULT_MESSAGE,
      name: ErrorName.UnprocessableEntity,
    });
  }
}
