import express from "express";
import { connectRedis } from "./src/redisClient.js";
import { rateLimiter } from "./src/middleware/rateLimiter.js";
import productRoutes from "./src/routes/products.js";
import authRoutes from "./src/routes/auth.js";

const app = express();
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);

// rate limiting only on the product routes - that's the ones getting
// hit hardest/most often in a real e-commerce app
app.use("/api", rateLimiter(), productRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  await connectRedis();
  app.listen(PORT, () => console.log(`server running on port ${PORT}`));
}

start();
