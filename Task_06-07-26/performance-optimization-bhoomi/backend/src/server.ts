import express from "express";
import cors from "cors";

import itemRoutes from "./routes/items";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/items", itemRoutes);

const PORT = 3001;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});