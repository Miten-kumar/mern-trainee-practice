import app from "./app.js";

import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

import { env } from "./config/env.js";

async function startServer(): Promise<void> {
  try {
    /**
     * Connect to PostgreSQL
     * before starting the HTTP server.
     */
    await connectDatabase();

    const server = app.listen(
      env.PORT,
      () => {
        console.log(
          `Server running on http://localhost:${env.PORT}`
        );

        console.log(
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
      console.log(
        `${signal} received. Shutting down...`
      );

      server.close(async () => {
        await disconnectDatabase();

        console.log(
          "Database disconnected"
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
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

void startServer();