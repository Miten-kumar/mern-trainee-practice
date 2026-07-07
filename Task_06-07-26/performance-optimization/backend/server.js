import express from "express";
import cors from "cors";
import { ITEMS } from "./data.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// returns the full list, frontend does the virtualization
app.get("/api/items", (req, res) => {
  res.json(ITEMS);
});

// single item lookup, used by the item detail page
app.get("/api/items/:id", (req, res) => {
  const item = ITEMS.find((it) => it.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "item not found" });
  res.json(item);
});

app.listen(PORT, () => {
  console.log(`backend running on http://localhost:${PORT}`);
});
