import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

// Generic validator to ensure each value in a given object belongs to a specified enum
@ValidatorConstraint({ async: false })
export class IsEnumObjectConstraint implements ValidatorConstraintInterface {
  validate(object: Record<string, any>, args: ValidationArguments) {
    // The enum reference is passed as an argument to the decorator
    const [enumType] = args.constraints;

    if (typeof object !== 'object' || object === null) {
      // If it's not an object, let other validators (like @IsString) handle it
      return false;
    }

    const enumValues = Object.values(enumType);
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];
        if (!enumValues.includes(value)) {
          return false; // Found a value not present in the enum
        }
      }
    }
    return true; // All values are valid
  }

  defaultMessage(args: ValidationArguments) {
    const [enumType] = args.constraints;
    const enumName = enumType.name || 'Enum'; // Get enum name for better message
    return `Each value in ${args.property} must be a valid value from the ${enumName}.`;
  }
}

// Custom decorator factory to make IsEnumObjectConstraint reusable
export function IsEnumObject(enumType: object, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [enumType], // Pass the enumType as a constraint
      validator: IsEnumObjectConstraint,
    });
  };
}