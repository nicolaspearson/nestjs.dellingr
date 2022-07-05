import path from 'path';

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { convertSwaggerToDts } from '$/common/swagger/dts-exporter.swagger';
import { MainModule } from '$/main.module';

export async function bootstrap(): Promise<void> {
  console.log('Generating declaration files...');
  const app = await NestFactory.create(MainModule, { logger: false });
  const document = SwaggerModule.createDocument(app, new DocumentBuilder().build());
  const outputPath = path.resolve(process.cwd(), 'types/generated/dellingr.d.ts');
  await convertSwaggerToDts({
    document,
    namespace: 'Dellingr',
    outputPath,
  });
  console.log(`Declaration files generated and exported to: ${outputPath}`);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit(0);
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void bootstrap();
