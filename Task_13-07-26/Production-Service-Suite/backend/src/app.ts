import express from "express";
import helmet from "helmet";
import cors from "cors";

import userRoutes from "./routes/user.routes";


const app = express();


app.use(helmet());

app.use(cors());

app.use(express.json());


// Health check
app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Production Security Suite API is running"
  });

});


// API routes
app.use(
  "/api/users",
  userRoutes
);


export default app;