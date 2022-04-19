import { Request } from 'express';

import { BadRequestError } from '$/common/error';

export function multerPdfFileFilter(
  _: Request,
  file: Api.ThirdParty.MulterFile,
  callback: (error: Nullable<Error>, acceptFile: boolean) => void,
): void {
  file.mimetype === 'application/pdf'
    ? callback(null, true)
    : callback(new BadRequestError('Only files with a .pdf extension are allowed.'), false);
}
