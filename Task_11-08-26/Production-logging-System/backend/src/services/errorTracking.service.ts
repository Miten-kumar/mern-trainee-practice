import type {
  ErrorLogContext,
} from "../types/logging.types.js";

import { loggerService } from "./logger.service.js";

class ErrorTrackingService {
  captureException(
    error: Error,
    context: ErrorLogContext = {}
  ): void {
    loggerService.error(
      "Exception captured",
      {
        message: error.message,
        stack: error.stack,
        ...context,
      }
    );

    // Sentry integration will be added here.
  }
}

export const errorTrackingService =
  new ErrorTrackingService();