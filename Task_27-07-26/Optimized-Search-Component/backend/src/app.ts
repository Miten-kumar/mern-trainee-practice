import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import searchRoutes from "./routes/search.routes";

dotenv.config();

const app = express();


// ================================
// Middleware
// ================================

// Allow React frontend requests
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
app.use(express.json());


// Parse URL encoded data
app.use(
    express.urlencoded({
        extended: true
    })
);

// ================================
// API Routes
// ================================

app.use(
    "/api",
    searchRoutes
);

// ================================
// Health Check
// ================================

app.get(
    "/",
    (req,res)=>{

        res.status(200).json({

            message:
            "Optimized Search API running"

        });

    }
);

export default app;