/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { oneLine, oneLineTrim } from 'common-tags';

import { IsValidPasswordConstraint } from '$/common/validators/is-valid-password.validator';

const isValidPassword = new IsValidPasswordConstraint();

describe('Is Valid Password Validator', () => {
  test('should return false if undefined', () => {
    expect(isValidPassword.validate(undefined as any, {} as any)).toEqual(false);
  });

  test('should return false if too short', () => {
    expect(isValidPassword.validate('abc', {} as any)).toEqual(false);
  });

  test('should return false if too long', () => {
    expect(
      isValidPassword.validate(
        oneLineTrim`
        dbj_Y&F*@zS#vztaevz!aBBBWb=M&^ug%4_McAn9tEZT#hmz%Ky!KvnQn&n#jLW9cBqgTmu%
      `,
        {} as any,
      ),
    ).toEqual(false);
  });

  test('should return false if invalid', () => {
    expect(isValidPassword.validate('abcDEF123@#$\\u800', {} as any)).toEqual(false);
  });

  test('should return true if valid', () => {
    expect(isValidPassword.validate('abcDEF123@#$', {} as any)).toEqual(true);
    expect(
      isValidPassword.validate('Qgpn2DKr!3Jta$KvnQn&n#jLW9cBqgTmu%Yj2K+4d7SZLCKHdW', {} as any),
    ).toEqual(true);
    expect(isValidPassword.validate(' this is a V@l!d P@$$w0rd', {} as any)).toEqual(true);
  });

  test('should return the default error message correctly', () => {
    expect(isValidPassword.defaultMessage({} as any)).toEqual(oneLine`
      The password must between 6 and 50 characters in length and contain only
      lowercase characters / uppercase characters / numbers / special characters
       (!@#$%^&*()_+=[{]};:<>'" |.?,-)
    `);
  });
});
/* eslint-enable @typescript-eslint/no-unsafe-argument */
/* eslint-enable @typescript-eslint/no-explicit-any */
