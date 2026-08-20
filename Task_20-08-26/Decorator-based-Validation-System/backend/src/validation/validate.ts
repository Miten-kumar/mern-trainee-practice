import {
  getValidatorMetadata,
} from "./metadata";

export interface ValidationError {
  property: string;
  message: string;
}

export function validate(
  instance: object
): ValidationError[] {
  const metadata =
    getValidatorMetadata(
      instance.constructor
    );

  const errors: ValidationError[] = [];

  for (const {
    property,
    validator,
  } of metadata) {
    const value =
      (
        instance as Record<
          string,
          unknown
        >
      )[property];

    const error = validator(
      value,
      property,
      instance
    );

    if (error) {
      errors.push({
        property,
        message: error,
      });
    }
  }

  return errors;
}