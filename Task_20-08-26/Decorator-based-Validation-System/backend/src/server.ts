import "reflect-metadata";

import app from "./app";

import {
  env,
} from "./config/env";

const server =
  app.listen(
    env.port,
    () => {
      console.log(
        ` Server running at http://localhost:${env.port}`
      );

      console.log(
        ` API: http://localhost:${env.port}/api/v1`
      );

      console.log(
        ` Health: http://localhost:${env.port}/health`
      );
    }
  );

function shutdown(
  signal: string
): void {
  console.log(
    `\n${signal} received. Shutting down...`
  );

  server.close(
    (error) => {
      if (error) {
        console.error(
          "Shutdown error:",
          error
        );

        process.exit(1);
      }

      console.log(
        "Server closed successfully."
      );

      process.exit(0);
    }
  );
}

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);