import { Request, Response, NextFunction } from "express";
import redisClient from "../config/redis";

const WINDOW_TIME = 60; // seconds
const MAX_REQUESTS = 3;

export const rateLimiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    const key = `rate:${ip}`;

    const totalRequests = await redisClient.incr(key);

    if (totalRequests === 1) {
      await redisClient.expire(key, WINDOW_TIME);
    }

    if (totalRequests > MAX_REQUESTS) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
      });
    }

    next();
  } catch (error) {
    console.error(error);

    next();
  }
};