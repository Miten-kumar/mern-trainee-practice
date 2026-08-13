import type { Request } from "express";
import { authService } from "../services/auth.service.js";

export const getAuthenticatedUser = (
  req: Request
) => {
  const header =
    req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  const token =
    header.substring(7);

  try {
    return authService.verifyToken(
      token
    );
  } catch {
    return null;
  }
};