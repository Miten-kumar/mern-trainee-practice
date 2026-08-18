import Bull from "bull";
import dotenv from "dotenv";

dotenv.config();

export const imageQueue = new Bull("image-queue", {
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "fixed",
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});