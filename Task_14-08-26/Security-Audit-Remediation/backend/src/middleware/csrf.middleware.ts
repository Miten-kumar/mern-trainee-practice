import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { doubleCsrf } from "csrf-csrf";

import { env } from "../config/env.js";

const {
  generateCsrfToken,
  doubleCsrfProtection,
} = doubleCsrf({
  getSecret: () =>
    env.COOKIE_SECRET,

  getSessionIdentifier: (
    req: Request
  ): string => {
    return req.ip ?? "anonymous";
  },

  cookieName: "csrf-token",

  cookieOptions: {
    httpOnly: false,
    secure: false,
    sameSite: "strict",
    path: "/",
  },

  getCsrfTokenFromRequest: (
    req: Request
  ): string | null => {
    const token =
      req.headers["x-csrf-token"];

    if (Array.isArray(token)) {
      return token[0] ?? null;
    }

    return token ?? null;
  },
});

export const csrfToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      generateCsrfToken(req, res);

    res.locals.csrfToken = token;

    next();
  } catch (error) {
    next(error);
  }
};

export const csrfProtection =
  doubleCsrfProtection;