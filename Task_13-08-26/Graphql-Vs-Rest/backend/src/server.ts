import { env } from "./config/env.js";
import { connectDatabase, prisma } from "./config/database.js";
import app from "./app.js";

const startServer = async (): Promise<void> => {
  try {
    /**
     * Connect to PostgreSQL
     */
    await connectDatabase();

    /**
     * Start Express server
     */
    const server = app.listen(env.PORT, () => {
      console.log(
        `Server running at http://localhost:${env.PORT}`
      );

      console.log(
        ` REST API: http://localhost:${env.PORT}/api/v1`
      );

      console.log(
        ` GraphQL API: http://localhost:${env.PORT}/graphql`
      );

      console.log(
        ` Health Check: http://localhost:${env.PORT}/health`
      );
    });

    /**
     * Graceful shutdown
     */
    const shutdown = async () => {
      console.log("Shutting down server...");

      server.close(async () => {
        await prisma.$disconnect();

        console.log(" Database disconnected");

        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    console.error(" Server startup failed:", error);

    await prisma.$disconnect();

    process.exit(1);
  }
};

startServer();