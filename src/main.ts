import 'dotenv/config';
import helmet from 'helmet';
import { default as nocache } from 'nocache';
import 'reflect-metadata';
import { getConnection } from 'typeorm';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppService } from '$/app/app.service';
import { ConfigService } from '$/common/config/environment.config';
import { getContentResourcePolicy } from '$/common/config/helmet.config';
import { API_GLOBAL_PREFIX } from '$/common/constants';
import { ApiGroup } from '$/common/enum/api-group.enum';
import { ErrorFilter } from '$/common/filters/error.filter';
import { DtoValidationPipe } from '$/common/pipes/dto-validation.pipe';
import { MainModule } from '$/main.module';

declare const module: {
  hot: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => void;
  };
};

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(MainModule, {
    // Cross-origin resource sharing (CORS) is a mechanism that
    // allows resources to be requested from another domain
    cors: {
      credentials: true,
      methods: 'DELETE,HEAD,GET,OPTIONS,PATCH,POST,PUT',
      origin: [/localhost$/],
    },
  });
  const configService = app.get(ConfigService);
  app.useLogger([configService.logLevel]);

  // Helmet can help protect the app from some well-known web
  // vulnerabilities by setting the appropriate HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: getContentResourcePolicy(configService.nodeEnv),
    }),
  );

  // Disable for performance
  const httpAdapter = app.getHttpAdapter() as ExpressAdapter;
  httpAdapter.set('etag', false);
  httpAdapter.set('x-powered-by', false);
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

  // Initiate the seeding process
  if (configService.seedEnvironment) {
    await app.get<AppService>(AppService).seed(getConnection());
  }

  // Serve the application
  await app.listen(configService.apiPort, configService.apiHost);

  // Hot module replacement with Webpack
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
