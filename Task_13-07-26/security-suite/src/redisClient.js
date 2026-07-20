const { createClient } = require("redis");

const redisClient = createClient({
  url: `redis://${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || 6379}`,
});

redisClient.on("error", (err) => {
  console.error("redis error:", err.message);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = { redisClient, connectRedis };
