import { Transform } from 'class-transformer';

/**
 * This decorator converts a string to a boolean. If the value is not explicitly
 * set to "true" it will always returns false, this assists in parsing optional
 * values too, e.g. null or undefined.
 *
 * @returns The parsed boolean value.
 */
// Decorators should be PascalCase
// eslint-disable-next-line @typescript-eslint/naming-convention
export const ParseBoolean = (): PropertyDecorator =>
  Transform(({ value }: { value: string }) => value === 'true');
