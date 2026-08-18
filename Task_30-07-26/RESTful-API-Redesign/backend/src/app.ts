import express from "express";

import cors from "cors";

import routes from "./routes";

import { setupSwagger } from "./config/swagger";

import { apiLimiter } from "./middleware/rateLimit.middleware";

import { apiVersion } from "./middleware/apiVersion.middleware";

import { notFound } from "./middleware/notFound.middleware";

import { errorHandler } from "./middleware/error.middleware";


const app = express();

// -------------------------
// Global Middleware
// -------------------------

app.use(

    cors({

        origin:
        "http://localhost:5173",

        credentials:true

    })
);

app.use(
    express.json()
);

app.use(
    express.urlencoded({

        extended:true

    })
);


// -------------------------
// API Security
// -------------------------

app.use(
    apiLimiter
);

// -------------------------
// API Version Header
// -------------------------

app.use(
    apiVersion
);

// -------------------------
// Swagger Documentation
// -------------------------

setupSwagger(app);


// -------------------------
// Health Check
// -------------------------

app.get(
    "/health",

    (req,res)=>{

        res.status(200)
        .json({

            success:true,

            message:
            "REST API server is running",

            version:"v1"

        });
    }
);


// -------------------------
// Versioned Routes
// -------------------------

app.use(

    "/api/v1",

    routes

);

// -------------------------
// 404 Handler
// -------------------------

app.use(
    notFound
);

// -------------------------
// Global Error Handler
// -------------------------

app.use(
    errorHandler
);

export default app;