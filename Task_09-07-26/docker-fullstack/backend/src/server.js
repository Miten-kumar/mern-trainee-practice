import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import { redisClient, connectRedis } from "./redis.js";

const app = express();
app.use(cors());
app.use(express.json());

const NOTES_CACHE_KEY = "notes:all";
const CACHE_TTL_SECONDS = 30;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/notes", async (req, res) => {
  try {
    const cached = await redisClient.get(NOTES_CACHE_KEY);
    if (cached) {
      return res.json({ source: "cache", notes: JSON.parse(cached) });
    }

    const result = await pool.query(
      "SELECT id, text, created_at FROM notes ORDER BY id DESC"
    );
    await redisClient.set(NOTES_CACHE_KEY, JSON.stringify(result.rows), {
      EX: CACHE_TTL_SECONDS,
    });

    res.json({ source: "db", notes: result.rows });
  } catch (err) {
    console.error("failed to fetch notes:", err.message);
    res.status(500).json({ error: "failed to fetch notes" });
  }
});

app.post("/api/notes", async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: "note text is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO notes (text) VALUES ($1) RETURNING id, text, created_at",
      [text.trim()]
    );

    // data changed, so the cached list is now stale - just clear it
    // instead of trying to patch it in place
    await redisClient.del(NOTES_CACHE_KEY);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("failed to create note:", err.message);
    res.status(500).json({ error: "failed to create note" });
  }
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectRedis();
  app.listen(PORT, () => {
    console.log(`backend running on port ${PORT}`);
  });
}

start();
