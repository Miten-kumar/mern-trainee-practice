import express from "express";
import cors from "cors";
import userRoute from "./routes/user.routes";
import productRoute from "./routes/product.routes";

const app = express();


// Allow frontend requests
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: [
            "GET",
            "POST",
            "PUT",
            "DELETE"
        ],
        credentials: true
    })
);


// Parse JSON request body
app.use(
    express.json()
);


// Parse URL encoded data
app.use(
    express.urlencoded({
        extended: true
    })
);

// Health check API
app.get(
    "/api/health",
    (req, res) => {

        res.status(200)
        .json({

            success: true,

            message:
            "Backend is running"

        });
    }
);

// API Routes

app.use(
    "/api",
    userRoute
);

app.use(
    "/api",
    productRoute
);

// Global Error Handler

app.use(
    (
        err: Error,
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {

        console.error(err.message);

        res.status(500)
        .json({

            success:false,

            message:
            "Internal Server Error"

        });
    }
);

export default app;