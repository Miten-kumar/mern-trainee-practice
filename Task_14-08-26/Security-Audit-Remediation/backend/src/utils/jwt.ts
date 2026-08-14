import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

import type {
  JwtPayload,
} from "../types/auth.types.js";

export const generateAccessToken = (
  userId: string,
  role: "USER" | "ADMIN"
): string => {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );
};

export const verifyAccessToken = (
  token: string
): JwtPayload => {
  const decoded = jwt.verify(
    token,
    env.JWT_SECRET
  );

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.sub !== "string" ||
    (decoded.role !== "USER" &&
      decoded.role !== "ADMIN")
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    role: decoded.role,
  };
};