import { app } from "./app.js";

import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function startServer(): Promise<void> {
  try {
    /**
     * Connect PostgreSQL
     */
    await connectDatabase();

    /**
     * Start Express server
     */
    const server = app.listen(
      env.port,
      () => {
        logger.info(
          "Server started successfully",
          {
            port: env.port,
            environment: env.nodeEnv,
          }
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
        `${signal} received. Shutting down server...`
      );

      server.close(async () => {
        await disconnectDatabase();

        logger.info(
          "Server shutdown completed"
        );

        process.exit(0);
      });
    };

    process.on(
      "SIGTERM",
      () => {
        void shutdown("SIGTERM");
      }
    );

    process.on(
      "SIGINT",
      () => {
        void shutdown("SIGINT");
      }
    );
  } catch (error) {
    logger.error(
      "Failed to start server",
      {
        error,
      }
    );

    process.exit(1);
  }
}

void startServer();