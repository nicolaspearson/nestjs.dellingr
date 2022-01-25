import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorName } from '$/common/enum/error-name.enum';

import { BaseError } from './base.error';

const DEFAULT_MESSAGE = 'You are not authorized to access this endpoint.';

export class UnauthorizedError extends BaseError {
  @ApiProperty({
    description: 'The HTTP response code.',
    example: HttpStatus.UNAUTHORIZED,
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
    example: ErrorName.Unauthorized,
  })
  declare readonly name: string;

  constructor(message?: string, errors?: string[] | Record<string, unknown>[]) {
    super({
      code: HttpStatus.UNAUTHORIZED,
      errors,
      message: message || DEFAULT_MESSAGE,
      name: ErrorName.Unauthorized,
    });
  }
}
