import express, {
    Request,
    Response,
    NextFunction
} from "express";
import cors from "cors";

// Routes
import userRoutes from "./routes/user.routes";
import errorRoutes from "./routes/error.routes";

// Middleware
import errorMiddleware from "./middleware/error.middleware";
import notFoundMiddleware from "./middleware/notFound.middleware";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";


const app = express();


// ==========================
// Global Middleware
// ==========================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);


app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// ==========================
// Health Check API
// ==========================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            message: "Error Handling API Server Running"

        });

    }
);


// ==========================
// API Routes
// ==========================

app.use(
    "/api/users",
    userRoutes
);


app.use(
    "/api/errors",
    errorRoutes
);


// ==========================
// 404 Middleware
// ==========================

app.use(
    (
        req: Request,
        res: Response
    ) => {

        notFoundMiddleware(
            req,
            res
        );

    }
);


// ==========================
// Global Error Handler
// ==========================

app.use(
    (
        error: any,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        errorMiddleware(
            error,
            req,
            res,
            next
        );

    }
);


export default app;