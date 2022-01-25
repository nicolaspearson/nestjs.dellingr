import { ValidationError } from 'class-validator';

import { Injectable, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

import { BadRequestError } from '$/common/error';

@Injectable()
export class DtoValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      exceptionFactory,
      validationError: { target: false, value: false },
      whitelist: true,
      ...options,
    });
  }
}

export function exceptionFactory(errors: ValidationError[]): BadRequestError {
  return new BadRequestError('Validation failed.', [formatErrors(errors)]);
}

export function formatErrors(errors: ValidationError[], details = {}): Record<string, unknown> {
  if (errors.length > 0) {
    for (const error of errors) {
      details =
        error.children && error.children.length > 0
          ? /* istanbul ignore next */ {
              ...details,
              [error.property]: formatErrors(error.children),
            }
          : {
              ...details,
              [error.property]: error.constraints,
            };
    }
  }
  return details;
}
