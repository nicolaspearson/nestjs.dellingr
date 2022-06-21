import newrelic from 'newrelic';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { inspect } from 'util';

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';

@Injectable()
export class NewRelicInterceptor<T> implements NestInterceptor {
  private readonly logger = new Logger(NewRelicInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<T> {
    this.logger.debug(`Interceptor before: ${inspect(context.getHandler().name)}`);
    return newrelic.startWebTransaction(context.getHandler().name, function () {
      const transaction = newrelic.getTransaction();
      return next.handle().pipe(
        tap(() => {
          console.log(`Interceptor after: ${inspect(context.getHandler().name)}`);
          return transaction.end();
        }),
      );
    });
  }
}
