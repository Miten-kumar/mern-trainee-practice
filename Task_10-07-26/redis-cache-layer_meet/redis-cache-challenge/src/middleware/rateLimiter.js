import { redisClient } from "../redisClient.js";

const WINDOW_SECONDS = 60;
const MAX_REQUESTS = 20;

// simple fixed-window counter: INCR a key per client, first request in
// the window sets it to expire, once the count goes over the limit we
// start rejecting until the window resets
export function rateLimiter() {
  return async (req, res, next) => {
    const key = `ratelimit:${req.ip}`;
    const count = await redisClient.incr(key);

    if (count === 1) {
      await redisClient.expire(key, WINDOW_SECONDS);
    }

    if (count > MAX_REQUESTS) {
      const ttl = await redisClient.ttl(key);
      return res.status(429).json({
        error: "too many requests, slow down",
        retryAfterSeconds: ttl,
      });
    }

    res.set("X-RateLimit-Limit", MAX_REQUESTS);
    res.set("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - count));
    next();
  };
}
