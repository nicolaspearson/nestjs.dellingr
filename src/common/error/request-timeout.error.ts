import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorName } from '$/common/enum/error-name.enum';

import { BaseError } from './base.error';

const DEFAULT_MESSAGE = 'The request has timed out.';

export class RequestTimeoutError extends BaseError {
  @ApiProperty({
    description: 'The HTTP response code.',
    example: HttpStatus.REQUEST_TIMEOUT,
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
    example: ErrorName.RequestTimeout,
  })
  declare readonly name: string;

  constructor(message?: string, errors?: string[] | Record<string, unknown>[]) {
    super({
      code: HttpStatus.REQUEST_TIMEOUT,
      errors,
      message: message || DEFAULT_MESSAGE,
      name: ErrorName.RequestTimeout,
    });
  }
}
