import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",

  port: Number(process.env.PORT ?? 5000),

  databaseUrl: process.env.DATABASE_URL ?? "",

  logLevel: process.env.LOG_LEVEL ?? "info",

  frontendUrl:
    process.env.FRONTEND_URL ?? "http://localhost:5173",

  logDirectory:
    process.env.LOG_DIRECTORY ?? "logs",

  alertErrorThreshold:
    Number(process.env.ALERT_ERROR_THRESHOLD ?? 10),

  alertResponseTimeThreshold:
    Number(process.env.ALERT_RESPONSE_TIME_THRESHOLD ?? 2000),

  sentryDsn:
    process.env.SENTRY_DSN ?? "",
};