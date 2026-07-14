import crypto from "crypto";
import { redisClient } from "../redisClient.js";

const SESSION_TTL_SECONDS = 60 * 30; // 30 min

export async function createSession(userData) {
  const sessionId = crypto.randomBytes(24).toString("hex");
  await redisClient.set(`session:${sessionId}`, JSON.stringify(userData), {
    EX: SESSION_TTL_SECONDS,
  });
  return sessionId;
}

export async function destroySession(sessionId) {
  await redisClient.del(`session:${sessionId}`);
}

// checks for a valid session and attaches the user to req.
// sends 401 if there's no session id or it's expired/invalid
export async function requireSession(req, res, next) {
  const sessionId = req.headers["x-session-id"];
  if (!sessionId) {
    return res.status(401).json({ error: "no session id provided" });
  }

  const sessionData = await redisClient.get(`session:${sessionId}`);
  if (!sessionData) {
    return res.status(401).json({ error: "session expired or invalid, please log in again" });
  }

  req.user = JSON.parse(sessionData);

  // sliding expiration - being active resets the clock instead of the
  // session dying exactly 30 min after login regardless of activity
  await redisClient.expire(`session:${sessionId}`, SESSION_TTL_SECONDS);

  next();
}
