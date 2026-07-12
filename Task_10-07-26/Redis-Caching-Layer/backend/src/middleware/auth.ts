import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getSession } from "../services/sessionService";

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role?: string;
    email?: string;
  };
}

interface JwtPayload {
  userId: number;
  sessionId: string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const session = await getSession(decoded.sessionId);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    req.user = session;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};