export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT) || 5000,

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",

  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  RATE_LIMIT_WINDOW:
    Number(process.env.RATE_LIMIT_WINDOW) || 60,

  RATE_LIMIT_MAX:
    Number(process.env.RATE_LIMIT_MAX) || 100,
};