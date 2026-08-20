import "reflect-metadata";

import {
  Request,
  Response,
  NextFunction,
} from "express";

type GuardFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const GUARD_METADATA_KEY = Symbol(
  "guardMetadata"
);

export function AuthGuard(): MethodDecorator {
  return (
    target,
    propertyKey
  ) => {
    const guards =
      (Reflect.getMetadata(
        GUARD_METADATA_KEY,
        target,
        propertyKey
      ) as GuardFunction[] | undefined) ?? [];

    guards.push(
      (
        req,
        res,
        next
      ) => {
        if (!req.user) {
          res.status(401).json({
            success: false,
            message:
              "Authentication required",
          });

          return;
        }

        next();
      }
    );

    Reflect.defineMetadata(
      GUARD_METADATA_KEY,
      guards,
      target,
      propertyKey
    );
  };
}

export function RoleGuard(
  requiredRole: string
): MethodDecorator {
  return (
    target,
    propertyKey
  ) => {
    const guards =
      (Reflect.getMetadata(
        GUARD_METADATA_KEY,
        target,
        propertyKey
      ) as GuardFunction[] | undefined) ?? [];

    guards.push(
      (
        req,
        res,
        next
      ) => {
        if (!req.user) {
          res.status(401).json({
            success: false,
            message:
              "Authentication required",
          });

          return;
        }

        if (
          req.user.role !==
          requiredRole
        ) {
          res.status(403).json({
            success: false,
            message:
              "Insufficient permissions",
          });

          return;
        }

        next();
      }
    );

    Reflect.defineMetadata(
      GUARD_METADATA_KEY,
      guards,
      target,
      propertyKey
    );
  };
}

export function getGuards(
  target: object,
  propertyKey: string
): GuardFunction[] {
  return (
    (Reflect.getMetadata(
      GUARD_METADATA_KEY,
      target,
      propertyKey
    ) as GuardFunction[] | undefined) ?? []
  );
}