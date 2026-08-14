import app from "./app.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

const startServer = async (): Promise<void> => {
  try {
    /**
     * Connect to database
     */
    await connectDatabase();

    logger.info("Database connected successfully");

    /**
     * Start HTTP server
     */
    const server = app.listen(
      env.PORT,
      () => {
        logger.info(
          `Server running on port ${env.PORT}`
        );

        logger.info(
          `Environment: ${env.NODE_ENV}`
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
        `${signal} received. Starting graceful shutdown...`
      );

      server.close(async () => {
        try {
          await disconnectDatabase();

          logger.info(
            "Database disconnected successfully"
          );

          logger.info(
            "Server shutdown completed"
          );

          process.exit(0);
        } catch (error) {
          logger.error(
            "Error during shutdown",
            {
              error:
                error instanceof Error
                  ? error.message
                  : "Unknown error",
            }
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
      {
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      }
    );

    await disconnectDatabase();

    process.exit(1);
  }
};

void startServer();