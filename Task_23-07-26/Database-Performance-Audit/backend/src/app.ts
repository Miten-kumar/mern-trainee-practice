import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";


// Routes
import userRoutes from "./routes/user.routes";
import performanceRoutes from "./routes/performance.routes";

// Middleware
import { performanceMiddleware } from "./middleware/performance.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// Frontend connection

app.use(
    cors(corsOptions)
);

// Parse JSON

app.use(
    express.json()
);

// Track API performance

app.use(
    performanceMiddleware
);

// API Routes

app.use(
    "/api",
    userRoutes
);

app.use(
    "/api",
    performanceRoutes
);

// Invalid route handler

app.use(
    notFoundMiddleware
);

// Global error handler

app.use(
    errorMiddleware
);

export default app;