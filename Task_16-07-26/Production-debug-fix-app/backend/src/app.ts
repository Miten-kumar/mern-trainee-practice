import express from "express";
import debugRoutes from "./routes/debug.routes";
import { logger } from "./utils/logger";


const app = express();


// Middleware
app.use(express.json());


// Request logger
app.use((req, _res, next) => {

  logger.info(
    `${req.method} ${req.url}`
  );

  next();

});


// Health check
app.get(
  "/health",
  (_req, res) => {

    res.json({
      status: "OK",
      uptime: process.uptime()
    });

  }
);


// Debug routes
app.use(
  "/api",
  debugRoutes
);


// Global error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {

    logger.error(
      err.message
    );


    res.status(500).json({
      message: "Internal Server Error"
    });

  }
);


export default app;