const { redisClient } = require("../redisClient.js");

// "flexible" just means you pass in your own limits instead of one
// hardcoded number for the whole api - a login route probably needs a
// stricter limit than a general search route, for example
function rateLimiter({ windowSeconds = 60, maxRequests = 20 } = {}) {
  return async (req, res, next) => {
    const key = `ratelimit:${req.baseUrl}${req.path}:${req.ip}`;

    try {
      const count = await redisClient.incr(key);

      if (count === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (count > maxRequests) {
        const ttl = await redisClient.ttl(key);
        return res.status(429).json({
          error: "too many requests, slow down",
          retryAfterSeconds: ttl,
        });
      }

      res.set("X-RateLimit-Limit", maxRequests);
      res.set("X-RateLimit-Remaining", Math.max(0, maxRequests - count));
      next();
    } catch (err) {
      // if redis itself is down, don't take the whole api down with it -
      // log it and let the request through instead of blocking everyone
      console.error("rate limiter redis error:", err.message);
      next();
    }
  };
}

module.exports = { rateLimiter };
