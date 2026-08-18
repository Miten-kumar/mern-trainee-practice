import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = app.listen(env.port, () => {
      console.log(
        `Server running on http://localhost:${env.port}`
      );
    });

    /**
     * Graceful shutdown
     */
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        await disconnectDatabase();

        console.log("Server shut down successfully");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => {
      void shutdown("SIGTERM");
    });

    process.on("SIGINT", () => {
      void shutdown("SIGINT");
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
};

void startServer();