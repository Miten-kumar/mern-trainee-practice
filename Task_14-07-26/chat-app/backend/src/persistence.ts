import fs from "fs";
import path from "path";
import type { Message } from "./types.js";

const DATA_FILE = path.join(process.cwd(), "data", "messages.json");
const MAX_HISTORY_PER_ROOM = 100; // don't let one room's history grow forever

// room -> messages, loaded once at startup and kept in memory after that.
// simple write-through to disk on every new message - fine at this scale,
// a real app would use an actual database instead of a json file
let messagesByRoom: Record<string, Message[]> = {};

export function loadMessages() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    messagesByRoom = JSON.parse(raw);
  } catch {
    // file doesn't exist yet on first run, start empty
    messagesByRoom = {};
  }
}

function saveMessages() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(messagesByRoom, null, 2));
}

export function getRoomHistory(room: string): Message[] {
  return messagesByRoom[room] ?? [];
}

export function saveMessage(message: Message) {
  if (!messagesByRoom[message.room]) {
    messagesByRoom[message.room] = [];
  }
  messagesByRoom[message.room].push(message);

  // trim oldest messages once a room passes the cap
  if (messagesByRoom[message.room].length > MAX_HISTORY_PER_ROOM) {
    messagesByRoom[message.room] = messagesByRoom[message.room].slice(
      -MAX_HISTORY_PER_ROOM
    );
  }

  saveMessages();
}
