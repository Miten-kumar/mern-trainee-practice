import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("connect", () => {
  console.log(" Redis Connected");
});

redisClient.on("error", (err) => {
  console.error(" Redis Error:", err);
});

(async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis Connection Failed:", error);
  }
})();

export default redisClient;