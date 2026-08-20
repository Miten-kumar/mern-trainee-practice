import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import {
  getGuards,
} from "../decorators/guards";

export function executeGuards(
  controller: object,
  method: string
): RequestHandler {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const guards =
      getGuards(
        controller,
        method
      );

    let index = 0;

    const runNextGuard =
      (): void => {
        if (
          index >= guards.length
        ) {
          next();
          return;
        }

        const guard =
          guards[index++];

        guard(
          req,
          res,
          runNextGuard
        );
      };

    runNextGuard();
  };
}