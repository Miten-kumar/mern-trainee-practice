import "reflect-metadata";

export type ValidatorFunction = (
  value: unknown,
  property: string,
  object: object
) => string | null;

export interface ValidatorMetadata {
  property: string;
  validator: ValidatorFunction;
}

const VALIDATOR_METADATA_KEY = Symbol(
  "validatorMetadata"
);

export function addValidatorMetadata(
  target: object,
  property: string,
  validator: ValidatorFunction
): void {
  const constructor = target.constructor;

  const existing =
    (Reflect.getMetadata(
      VALIDATOR_METADATA_KEY,
      constructor
    ) as ValidatorMetadata[] | undefined) ?? [];

  existing.push({
    property,
    validator,
  });

  Reflect.defineMetadata(
    VALIDATOR_METADATA_KEY,
    existing,
    constructor
  );
}

export function getValidatorMetadata(
  constructor: Function
): ValidatorMetadata[] {
  return (
    (Reflect.getMetadata(
      VALIDATOR_METADATA_KEY,
      constructor
    ) as ValidatorMetadata[] | undefined) ?? []
  );
}