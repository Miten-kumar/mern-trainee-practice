import { Router } from "express";
import { createSession, destroySession, requireSession } from "../middleware/session.js";

const router = Router();

// no real password check here on purpose - the point of this task is
// the redis session storage, not building a full auth system
router.post("/login", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "username is required" });
  }

  const sessionId = await createSession({ username });
  res.json({ sessionId });
});

router.post("/logout", async (req, res) => {
  const sessionId = req.headers["x-session-id"];
  if (sessionId) await destroySession(sessionId);
  res.json({ loggedOut: true });
});

router.get("/me", requireSession, (req, res) => {
  res.json({ user: req.user });
});

export default router;
