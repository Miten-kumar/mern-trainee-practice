import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),

  PORT: z.coerce
    .number()
    .default(5000),

  FRONTEND_URL: z
    .string()
    .default("http://localhost:5173"),

  NODE_ENV: z
    .enum([
      "development",
      "test",
      "production",
    ])
    .default("development"),
});

export const env = envSchema.parse(
  process.env
);