import "reflect-metadata";

export type TransformFunction = (
  value: unknown
) => unknown;

const TRANSFORM_METADATA_KEY = Symbol(
  "transformMetadata"
);

export function Transform(
  transform: TransformFunction
): PropertyDecorator {
  return (
    target,
    propertyKey
  ) => {
    const constructor =
      target.constructor;

    const existing =
      (Reflect.getMetadata(
        TRANSFORM_METADATA_KEY,
        constructor
      ) as Map<
        string | symbol,
        TransformFunction
      > | undefined) ??
      new Map();

    existing.set(
      propertyKey,
      transform
    );

    Reflect.defineMetadata(
      TRANSFORM_METADATA_KEY,
      existing,
      constructor
    );
  };
}

export function getTransformMetadata(
  constructor: Function
): Map<
  string | symbol,
  TransformFunction
> {
  return (
    (Reflect.getMetadata(
      TRANSFORM_METADATA_KEY,
      constructor
    ) as Map<
      string | symbol,
      TransformFunction
    > | undefined) ??
    new Map()
  );
}