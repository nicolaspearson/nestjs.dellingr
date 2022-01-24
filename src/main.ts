import { default as nocache } from 'nocache';

import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from '$/app.module';

declare const module: {
  hot: {
    accept: () => void;
    dispose: (callback: () => Promise<void>) => void;
  };
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Disable for performance
  const httpAdapter = app.getHttpAdapter() as ExpressAdapter;
  httpAdapter.set('etag', false);
  httpAdapter.set('x-powered-by', false);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(nocache());

  await app.listen(3000);

  // Hot module replacement with Webpack
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
