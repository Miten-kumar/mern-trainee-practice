import app from "./app.js";

import { env } from "./config/env.js";

import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

import { logger } from "./utils/logger.js";

const startServer = async (): Promise<void> => {
  try {
    /**
     * Connect to PostgreSQL
     * before starting the HTTP server.
     */
    await connectDatabase();

    const server = app.listen(
      env.PORT,
      () => {
        logger.info(
          `Server running on http://localhost:${env.PORT}`
        );
      }
    );

    /**
     * Graceful shutdown
     */
    const shutdown = async (
      signal: string
    ): Promise<void> => {
      logger.info(
        `Received ${signal}. Shutting down...`
      );

      server.close(async () => {
        try {
          await disconnectDatabase();

          logger.info(
            "Database connection closed"
          );

          logger.info(
            "HTTP server closed"
          );

          process.exit(0);
        } catch (error) {
          logger.error(
            "Error during shutdown",
            { error }
          );

          process.exit(1);
        }
      });
    };

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });
  } catch (error) {
    logger.error(
      "Failed to start server",
      { error }
    );

    process.exit(1);
  }
};

void startServer();