import "dotenv/config";
import process from "process";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce
    .number()
    .default(5000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),

  FRONTEND_URL: z
    .string()
    .url("FRONTEND_URL must be a valid URL"),
});

export const env = envSchema.parse(process.env);