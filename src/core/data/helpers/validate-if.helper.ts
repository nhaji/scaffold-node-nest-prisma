/**
 * A reusable function to generate a predicate for `@ValidateIf` decorator.
 * It checks if a specific property on the validated object is defined, not null,
 * and has been successfully transformed into an object.
 *
 * @param propertyName The name of the property to check in the `@ValidateIf` condition.
 * @returns A predicate function compatible with `@ValidateIf`.
 */
export function validateIfIsDefinedAndObject(propertyName: string) {
  return (object: any) => {
    const value = object[propertyName];
    return value !== undefined && value !== null && typeof value === 'object';
  };
}
