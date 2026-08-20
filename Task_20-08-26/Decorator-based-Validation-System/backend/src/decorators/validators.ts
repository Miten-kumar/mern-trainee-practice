import {
  addValidatorMetadata,
} from "../validation/metadata";

export function IsRequired(): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    addValidatorMetadata(
      target,
      propertyKey.toString(),
      (value, property) => {
        if (
          value === undefined ||
          value === null ||
          value === ""
        ) {
          return `${property} is required`;
        }

        return null;
      }
    );
  };
}

export function IsString(): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    addValidatorMetadata(
      target,
      propertyKey.toString(),
      (value, property) => {
        if (
          value !== undefined &&
          typeof value !== "string"
        ) {
          return `${property} must be a string`;
        }

        return null;
      }
    );
  };
}

export function IsEmail(): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    addValidatorMetadata(
      target,
      propertyKey.toString(),
      (value, property) => {
        if (
          typeof value !== "string"
        ) {
          return null;
        }

        const emailRegex =
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
          return `${property} must be a valid email`;
        }

        return null;
      }
    );
  };
}

export function IsNumber(): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    addValidatorMetadata(
      target,
      propertyKey.toString(),
      (value, property) => {
        if (
          value !== undefined &&
          typeof value !== "number"
        ) {
          return `${property} must be a number`;
        }

        if (
          typeof value === "number" &&
          !Number.isFinite(value)
        ) {
          return `${property} must be a valid number`;
        }

        return null;
      }
    );
  };
}

export function MinLength(
  minimum: number
): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    addValidatorMetadata(
      target,
      propertyKey.toString(),
      (value, property) => {
        if (
          typeof value !== "string"
        ) {
          return null;
        }

        if (
          value.length < minimum
        ) {
          return `${property} must contain at least ${minimum} characters`;
        }

        return null;
      }
    );
  };
}

export function IsStrongPassword(): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    addValidatorMetadata(
      target,
      propertyKey.toString(),
      (value, property) => {
        if (
          typeof value !== "string"
        ) {
          return null;
        }

        const strongPassword =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

        if (
          !strongPassword.test(value)
        ) {
          return `${property} must contain at least 8 characters, uppercase, lowercase, number and special character`;
        }

        return null;
      }
    );
  };
}