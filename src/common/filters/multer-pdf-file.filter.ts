import { Request } from 'express';

import { BadRequestError } from '$/common/error';

export type MulterFile = {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;
};

export function multerPdfFileFilter(
  _: Request,
  file: MulterFile,
  callback: (error: Nullable<Error>, acceptFile: boolean) => void,
): void {
  file.mimetype === 'application/pdf'
    ? callback(null, true)
    : callback(new BadRequestError('Only files with a .pdf extension are allowed.'), false);
}
