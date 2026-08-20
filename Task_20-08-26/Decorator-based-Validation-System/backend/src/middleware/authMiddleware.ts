import {
  Request,
  Response,
  NextFunction,
} from "express";

export function mockAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authorization =
    req.headers.authorization;

  if (
    authorization ===
    "Bearer admin-token"
  ) {
    req.user = {
      id: "admin-1",
      email: "admin@example.com",
      role: "admin",
    };
  }

  next();
}