import 'dotenv/config';
import helmet from 'helmet';
import { default as nocache } from 'nocache';

import { LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { getContentResourcePolicy } from '$/common/config/helmet.config';
import { MainModule } from '$/main.module';

declare const module: {
  hot: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => void;
  };
};

async function bootstrap() {
  const logLevel = [process.env.LOG_LEVEL || 'log'] as LogLevel[];
  const app = await NestFactory.create(MainModule, {
    // Cross-origin resource sharing (CORS) is a mechanism that
    // allows resources to be requested from another domain
    cors: {
      credentials: true,
      methods: 'DELETE,HEAD,GET,OPTIONS,PATCH,POST,PUT',
      origin: [/localhost$/],
    },
    logger: logLevel,
  });
  const configService = app.get(ConfigService);

  // Helmet can help protect the app from some well-known web
  // vulnerabilities by setting the appropriate HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: getContentResourcePolicy(),
    }),
  );

  // Disable for performance
  const httpAdapter = app.getHttpAdapter() as ExpressAdapter;
  httpAdapter.set('etag', false);
  httpAdapter.set('x-powered-by', false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(nocache());

  // Set the global API route prefix
  app.setGlobalPrefix('/api/v1');

  // Serve the application
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await app.listen(configService.get<number>('API_PORT')!, configService.get<string>('API_HOST')!);

  // Hot module replacement with Webpack
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
