import "dotenv/config";
import process from "process";

const requiredEnv = [
  "DATABASE_URL",
  "FRONTEND_URL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",

  PORT: Number(process.env.PORT ?? 5000),

  DATABASE_URL: process.env.DATABASE_URL!,

  FRONTEND_URL: process.env.FRONTEND_URL!,
};