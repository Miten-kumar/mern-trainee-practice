import { logger } from "../config/logger.js";

import {
  redactSensitiveData,
} from "./redaction.service.js";

import type {
  ErrorLogContext,
  LogContext,
} from "../types/logging.types.js";

class LoggerService {
  info(
    message: string,
    context: LogContext = {}
  ): void {
    const safeContext =
      redactSensitiveData(context);

    logger.info(message, safeContext);
  }

  warn(
    message: string,
    context: LogContext = {}
  ): void {
    const safeContext =
      redactSensitiveData(context);

    logger.warn(message, safeContext);
  }

  error(
    message: string,
    context: ErrorLogContext = {}
  ): void {
    const safeContext =
      redactSensitiveData(context);

    logger.error(message, safeContext);
  }

  debug(
    message: string,
    context: LogContext = {}
  ): void {
    const safeContext =
      redactSensitiveData(context);

    logger.debug(message, safeContext);
  }
}

export const loggerService =
  new LoggerService();