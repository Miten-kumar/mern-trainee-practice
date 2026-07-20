import { io, Socket } from "socket.io-client";
import type { ClientToServerEvents, ServerToClientEvents } from "./types";

const SERVER_URL = "http://localhost:5000";

export type ChatSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export function createSocket(token: string): ChatSocket {
  return io(SERVER_URL, {
    auth: { token },
    autoConnect: false,
  });
}

export async function login(username: string): Promise<{ token: string; username: string }> {
  const res = await fetch(`${SERVER_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "login failed");
  }

  return res.json();
}
