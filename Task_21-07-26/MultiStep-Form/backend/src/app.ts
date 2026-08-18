import express from "express";
import cors from "cors";
import dotenv from "dotenv";


import registrationRoutes from "./routes/registration.routes";

import { errorMiddleware } from "./middleware/error.middleware";

import { uploadErrorHandler } from "./middleware/upload.middleware";


dotenv.config();


const app = express();

// CORS connection with React frontend

app.use(
    cors({

        origin:"http://localhost:5173",

        credentials:true

    })
);


// Body parser

app.use(
    express.json()
);

app.use(
    express.urlencoded({
        extended:true
    })
);

// Static file access

app.use(

    "/uploads",

    express.static("uploads")
);

// Health check API

app.get(
"/",

(req,res)=>{

    res.json({

        success:true,

        message:"Multi Step Form Backend Running"

    });
});

// Registration Routes

app.use(

    "/api/registrations",

    registrationRoutes

);

// Multer Error Handler

app.use(
    uploadErrorHandler
);

// Global Error Handler

app.use(
    errorMiddleware
);

export default app;