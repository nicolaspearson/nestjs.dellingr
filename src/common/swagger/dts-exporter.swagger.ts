import { stripIndents } from 'common-tags';
import * as dtsGenerator from 'dtsgenerator';
import { writeFile } from 'fs';
import path from 'path';
import * as prettier from 'prettier';

import { OpenAPIObject } from '@nestjs/swagger';

interface SwaggerToDtsOptions {
  document: OpenAPIObject;
  namespace: string;
  outputPath: string;
}

function writeTextToFile(content: string, filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(filePath, content, (error) => {
      if (error) reject(error);
      resolve(undefined);
    });
  });
}

/**
 * Converts the provided Open API document object into a type
 * declaration file and stores it in the provided location.
 */
export async function convertSwaggerToDts(options: SwaggerToDtsOptions): Promise<void> {
  const jsonSchema = dtsGenerator.parseFileContent(JSON.stringify(options.document));
  const schema = dtsGenerator.parseSchema(jsonSchema);
  // We do not need to generate type declarations for the paths
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (schema.content as any)['paths'] = {};
  const dts = await dtsGenerator.default({
    contents: [schema],
  });
  const prettierConfig = await prettier.resolveConfig(path.resolve(process.cwd(), '.prettierrc'));
  const dtsLines = dts.split('\n');
  await writeTextToFile(
    prettier.format(
      stripIndents`
        /* eslint-disable @typescript-eslint/no-explicit-any */
        /**
         * Note: This file is auto generated and should NOT be edited manually.
         */
        declare namespace ${options.namespace} {
          ${dtsLines.slice(2, -3).join('\n')}
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
        `,
      prettierConfig ?? undefined,
    ),
    options.outputPath,
  );
}
