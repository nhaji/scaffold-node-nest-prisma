import { TransformFnParams } from 'class-transformer';

/**
 * A reusable transformation function for parsing stringified JSON values.
 * Intended for use with `@Transform` decorator from `class-transformer`.
 *
 * If the value is a string, it attempts to parse it as JSON.
 * If parsing fails, it returns the original value.
 *
 * @param params The transformation parameters provided by `class-transformer`.
 * @returns The parsed JSON object, the original value if parsing failed, or the value itself if not a string.
 */
export function JsonParseTransform(params: TransformFnParams): any {
  const { value } = params;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (e) {
      // If parsing fails, return the original string so other validators (e.g., @IsString, custom object validators) can catch it.
      return value;
    }
  }
  return value; // Return value as is if it's not a string
}