import { Request } from "express";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { ipKeyGenerator } from "express-rate-limit";

import { redisClient } from "../config/redis";
import logger from "../utils/logger";


export interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
  keyPrefix: string;
}


export function createRateLimiter(
  config: RateLimitConfig
) {

  return rateLimit({

    windowMs:
      config.windowSeconds * 1000,


    limit:
      config.maxRequests,


    standardHeaders: true,


    legacyHeaders: false,


    keyGenerator: (
      req: Request
    ) => {

      return ipKeyGenerator(
        req.ip ?? "unknown"
      );

    },


    // Important fix
    store: new RedisStore({

      sendCommand:
        async (...args: string[]) => {

          if (!redisClient.isOpen) {

            await redisClient.connect();

          }


          return redisClient.sendCommand(args);

        }

    }),


    handler: (
      req,
      res
    ) => {

      logger.warn(
        `Rate limit exceeded: ${req.ip}`
      );


      res.status(429).json({

        success:false,

        message:
          "Too many requests"

      });

    }

  });

}