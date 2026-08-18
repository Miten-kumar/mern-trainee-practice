import app from "./app";

import { env } from "./config/env";
import { prisma } from "./config/prisma";

import { logger } from "./utils/logger";

async function startServer(): Promise<void> {
  try {
    /*
     * Connect to PostgreSQL
     */
    await prisma.$connect();

    logger.info(
      "PostgreSQL connected successfully"
    );

    /*
     * Start Express server
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

    /*
     * Graceful shutdown
     */
    const shutdown = async (
      signal: string
    ) => {
      logger.info(
        `${signal} received. Shutting down...`
      );

      server.close(async () => {
        await prisma.$disconnect();

        logger.info(
          "PostgreSQL connection closed"
        );

        process.exit(0);
      });
    };

    process.on(
      "SIGINT",
      () => shutdown("SIGINT")
    );

    process.on(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );

  } catch (error) {

    logger.error(
      "Failed to start server",
      error
    );

    await prisma.$disconnect();

    process.exit(1);
  }
}

startServer();