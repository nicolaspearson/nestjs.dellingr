import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { oneLine } from 'common-tags';
import validator from 'validator';

const VALID_PASSWORD_REGEX = /^[\w !"#$%&'()*+,.:;<=>?@[\]^{|}-]*$/;

@ValidatorConstraint({ name: 'isValidPassword', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(text: string, _: ValidationArguments): boolean {
    // TODO: Add a check here that will test the strength of the password.
    return (
      text !== undefined &&
      text.length >= 6 &&
      text.length <= 50 &&
      validator.matches(text, VALID_PASSWORD_REGEX)
    );
  }

  defaultMessage(_: ValidationArguments): string {
    return oneLine`
      The password must between 6 and 50 characters in length and contain only
      lowercase characters / uppercase characters / numbers / special characters
      (!@#$%^&*()_+=[{]};:<>'" |.?,-)
    `;
  }
}

/* istanbul ignore next: validation tested above */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsValidPassword(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (object: Record<string, any>, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidPasswordConstraint,
    });
  };
}
