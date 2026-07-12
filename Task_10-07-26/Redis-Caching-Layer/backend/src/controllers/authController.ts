import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
  createSession,
  deleteSession,
} from "../services/sessionService";

// LOGIN
export const login = async (
  req: Request,
  res: Response
) => {
  try {
    // Normally validate user from PostgreSQL
    const user = {
      id: 1,
      email: "admin@gmail.com",
      role: "admin",
    };

    const sessionId = crypto.randomUUID();

    await createSession(sessionId, {
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const token = jwt.sign(
      {
        userId: user.id,
        sessionId,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// LOGOUT
export const logout = async (
  req: Request,
  res: Response
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(400).json({
        message: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as {
      sessionId: string;
    };

    await deleteSession(decoded.sessionId);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};