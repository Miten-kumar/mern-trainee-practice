import express, { Application, Request, Response } from "express";
import cors from "cors";

import tabRoutes from "./routes/tabs";

const app: Application = express();

const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Flexible Tab Component System Backend Running 🚀",
  });
});

// API Routes
app.use("/api/tabs", tabRoutes);

// 404 Route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});