import {
  addValidatorMetadata,
} from "../validation/metadata";

export function IsAdult(): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    addValidatorMetadata(
      target,
      propertyKey.toString(),
      (value, property) => {
        if (
          typeof value !== "number"
        ) {
          return `${property} must be a number`;
        }

        if (value < 18) {
          return `${property} must be at least 18 years old`;
        }

        return null;
      }
    );
  };
}