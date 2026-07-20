import crypto from "crypto";
import type { Socket } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types.js";

// token -> username, kept in memory since there's no real account system
// here - good enough for a demo chat app, wouldn't survive a restart
// (same limitation the login endpoint from the redis challenge had)
const tokens = new Map<string, string>();

export function issueToken(username: string): string {
  const token = crypto.randomBytes(16).toString("hex");
  tokens.set(token, username);
  return token;
}

export function getUsernameForToken(token: string): string | undefined {
  return tokens.get(token);
}

type ChatSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

// runs before a socket connection is accepted - rejects it outright if
// the token doesn't match a logged in user
export function socketAuthMiddleware(
  socket: ChatSocket,
  next: (err?: Error) => void
) {
  const token = socket.handshake.auth?.token as string | undefined;
  const username = token ? getUsernameForToken(token) : undefined;

  if (!username) {
    next(new Error("unauthorized - please log in again"));
    return;
  }

  socket.data.username = username;
  socket.data.userId = token as string;
  next();
}
