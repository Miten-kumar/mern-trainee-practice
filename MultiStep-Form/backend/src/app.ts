import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import formRoutes from "./routes/form.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

import errorMiddleware from "./middleware/error.middleware.js";


dotenv.config();


const app = express();


// Middlewares

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
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


// Static folder for uploaded files

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);



// API Routes

app.use(
  "/api/forms",
  formRoutes
);


app.use(
  "/api/upload",
  uploadRoutes
);



// Health Check API

app.get(
  "/",
  (req,res)=>{

    res.json({

      success:true,

      message:
        "Multi Step Form API Running"

    });

  }
);



// Global Error Handler

app.use(
  errorMiddleware
);



export default app;