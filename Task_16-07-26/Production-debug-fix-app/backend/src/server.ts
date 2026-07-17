import app from "./app";
import { logger } from "./utils/logger";


const PORT = Number(
  process.env.PORT || 3000
);


const server = app.listen(
  PORT,
  () => {

    logger.info(
      `Server running on port ${PORT}`
    );

  }
);


// Graceful shutdown

process.on(
  "SIGTERM",
  () => {

    logger.info(
      "SIGTERM received. Closing server..."
    );


    server.close(() => {

      logger.info(
        "Server closed"
      );


      process.exit(0);

    });

  }
);


process.on(
  "SIGINT",
  () => {

    logger.info(
      "SIGINT received. Closing server..."
    );


    server.close(() => {

      process.exit(0);

    });

  }
);