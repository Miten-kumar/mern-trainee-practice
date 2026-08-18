import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./config/database.js";

async function startServer(): Promise<void> {
  try {
    // Connect to PostgreSQL through Prisma
    await connectDatabase();

    const server = app.listen(env.PORT, () => {
      console.log(
        `Server running on http://localhost:${env.PORT}`
      );
    });

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`${signal} received. Shutting down...`);

      server.close(async () => {
        await disconnectDatabase();

        console.log("Server shutdown completed");
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
}

void startServer();