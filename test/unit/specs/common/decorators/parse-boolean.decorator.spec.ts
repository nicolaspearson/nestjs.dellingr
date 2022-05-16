import { plainToInstance } from 'class-transformer';
import { IsBoolean } from 'class-validator';

import { ParseBoolean } from '$/common/decorators/parse-boolean.decorator';

describe('Parse Boolean', () => {
  class ParseBooleanTestClass {
    @ParseBoolean()
    @IsBoolean()
    isValid!: boolean;
  }

  test('should parse correctly if undefined', () => {
    const instance = plainToInstance(ParseBooleanTestClass, { isValid: undefined });
    expect(instance.isValid).toEqual(false);
  });

  test('should parse correctly if false', () => {
    const instance = plainToInstance(ParseBooleanTestClass, { isValid: 'false' });
    expect(instance.isValid).toEqual(false);
  });

  test('should parse correctly if true', () => {
    const instance = plainToInstance(ParseBooleanTestClass, { isValid: 'true' });
    expect(instance.isValid).toEqual(true);
  });
});
