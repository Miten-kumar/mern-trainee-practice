import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();


// Global Middleware

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

// Health Check API

app.get(
    "/health",
    (req,res)=>{

        res.status(200).json({

            success:true,

            message:
            "Server is running"

        });

    }
);

// Product Routes

app.use(
    "/api",
    productRoutes
);

// Global Error Handler
// Always keep at last

app.use(
    errorHandler
);

export default app;