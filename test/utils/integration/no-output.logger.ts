import { LoggerService } from '@nestjs/common';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
export class NoOutputLogger implements LoggerService {
  debug(_: unknown, __?: string | undefined) {}
  error(_: unknown, ___?: string | undefined, __?: string | undefined) {}
  log(_: unknown, __?: string | undefined) {}
  verbose(_: unknown, __?: string | undefined) {}
  warn(_: unknown, __?: string | undefined) {}
}
/* eslint-enable @typescript-eslint/explicit-function-return-type */
/* eslint-enable @typescript-eslint/no-empty-function */
/* eslint-enable @typescript-eslint/naming-convention */
