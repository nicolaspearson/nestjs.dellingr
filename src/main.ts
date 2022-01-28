import 'dotenv/config';
import helmet from 'helmet';
import { default as nocache } from 'nocache';
import { getConnection } from 'typeorm';

import { LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { getContentResourcePolicy } from '$/common/config/helmet.config';
import { API_GLOBAL_PREFIX } from '$/common/constants';
import { ApiGroup } from '$/common/enum/api-group.enum';
import { Environment } from '$/common/enum/environment.enum';
import { ErrorFilter } from '$/common/filters/error.filter';
import { DtoValidationPipe } from '$/common/pipes/dto-validation.pipe';
import { seed } from '$/db/utils/seed.util';
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

  // Register global filters, pipes, and interceptors
  app.useGlobalFilters(new ErrorFilter());
  app.useGlobalPipes(new DtoValidationPipe());

  // Set the global route prefix
  app.setGlobalPrefix(API_GLOBAL_PREFIX);

  // Configure swagger
  const builder = new DocumentBuilder().addBearerAuth().setTitle('Dellingr API').setVersion('1.0');
  for (const group of Object.values(ApiGroup)) {
    builder.addTag(group);
  }
  const document = SwaggerModule.createDocument(app, builder.build());
  SwaggerModule.setup('docs/dellingr', app, document);

  if (process.env.NODE_ENV === Environment.Development) {
    // Seed the database with fixtures in the development environment
    await seed(getConnection());
  }

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
