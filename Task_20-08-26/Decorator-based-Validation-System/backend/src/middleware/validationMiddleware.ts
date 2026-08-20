import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import {
  getTransformMetadata,
} from "../decorators/transform";

import {
  validate,
} from "../validation/validate";

type DtoConstructor<T extends object> =
  new () => T;

export function validateBody<
  T extends object
>(
  DtoClass: DtoConstructor<T>
): RequestHandler {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto =
        new DtoClass();

      Object.assign(
        dto,
        req.body
      );

      const transforms =
        getTransformMetadata(
          DtoClass
        );

      for (
        const [
          property,
          transform,
        ] of transforms
      ) {
        const key =
          property.toString();

        const value =
          (
            dto as Record<
              string,
              unknown
            >
          )[key];

        (
          dto as Record<
            string,
            unknown
          >
        )[key] =
          transform(value);
      }

      const errors =
        validate(dto);

      if (errors.length > 0) {
        res.status(400).json({
          success: false,
          message:
            "Validation failed",
          errors,
        });

        return;
      }

      req.body = dto;

      next();
    } catch (error) {
      next(error);
    }
  };
}