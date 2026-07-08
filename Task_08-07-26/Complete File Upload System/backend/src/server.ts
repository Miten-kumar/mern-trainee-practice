import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import path from "path";

import uploadRoutes from "./routes/upload.js";

const app: Application = express();

const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "src/uploads"))
);

// Home Route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Complete File Upload System API Running 🚀",
  });
});

// Upload Routes
app.use("/api/upload", uploadRoutes);

// 404 Route
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Global Error Handler
app.use(
  (
    err: Error,
    req: Request,
    res: Response,
    next: express.NextFunction
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});