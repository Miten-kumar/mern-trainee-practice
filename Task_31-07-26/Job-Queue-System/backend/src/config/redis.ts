import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis Connected");
});

redis.on("error", (error) => {
  console.error("Redis Error:", error.message);
});

export default redis;