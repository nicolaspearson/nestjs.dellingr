/* eslint-disable jest/no-done-callback */
import { BadRequestError } from '$/common/error';
import { MulterFile, multerPdfFileFilter } from '$/common/filters/multer-pdf-file.filter';

import { requestMock } from '#/utils/fixtures';

describe('Multer PDF File Filter', () => {
  test('should return no error and accept the file if the mimetype is application/pdf', (done) => {
    function callback(error: Error | null, acceptFile: boolean): void {
      expect(error).toBeNull();
      expect(acceptFile).toBeTruthy();
      done();
    }
    multerPdfFileFilter(requestMock, { mimetype: 'application/pdf' } as MulterFile, callback);
  });

  test('should return an error and not accept the file if the mimetype is not application/pdf', (done) => {
    function callback(error: Error | null, acceptFile: boolean): void {
      expect(error).toBeInstanceOf(BadRequestError);
      expect(acceptFile).toBeFalsy();
      done();
    }
    multerPdfFileFilter(requestMock, { mimetype: 'image/png' } as MulterFile, callback);
  });
});
/* eslint-enable jest/no-done-callback */
