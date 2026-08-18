import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { env } from "./env.js";

const { combine, timestamp, json, errors } = winston.format;

const consoleFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const fileFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const consoleTransport = new winston.transports.Console({
  level: env.logLevel,
  format: consoleFormat,
});

const combinedTransport = new DailyRotateFile({
  filename: `${env.logDirectory}/combined-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
  level: "info",
  format: fileFormat,
  zippedArchive: true,
});

const errorTransport = new DailyRotateFile({
  filename: `${env.logDirectory}/error-%DATE%.log`,
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "30d",
  level: "error",
  format: fileFormat,
  zippedArchive: true,
});

export const logger = winston.createLogger({
  level: env.logLevel,

  defaultMeta: {
    service: "production-logging-system",
    environment: env.nodeEnv,
  },

  transports: [
    consoleTransport,
    combinedTransport,
    errorTransport,
  ],
});