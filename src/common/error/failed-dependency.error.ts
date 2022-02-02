import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ErrorName } from '$/common/enum/error-name.enum';

import { BaseError } from './base.error';

const DEFAULT_MESSAGE = 'The request failed due to failure of a previous request.';

export class FailedDependencyError extends BaseError {
  @ApiProperty({
    description: 'The HTTP response code.',
    example: HttpStatus.FAILED_DEPENDENCY,
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
    example: ErrorName.FailedDependency,
  })
  declare readonly name: string;

  constructor(message?: string, errors?: string[] | Record<string, unknown>[]) {
    super({
      code: HttpStatus.FAILED_DEPENDENCY,
      errors,
      message: message || DEFAULT_MESSAGE,
      name: ErrorName.FailedDependency,
    });
  }
}
