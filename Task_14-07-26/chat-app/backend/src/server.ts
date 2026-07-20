import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import crypto from "crypto";
import { issueToken, socketAuthMiddleware } from "./auth.js";
import { loadMessages, getRoomHistory, saveMessage } from "./persistence.js";
import { addToRoom, removeFromRoom, removeFromAllRooms, getOnlineUsernames } from "./presence.js";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData,
} from "./types.js";

loadMessages();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/login", (req, res) => {
  const { username } = req.body;
  if (!username || typeof username !== "string" || !username.trim()) {
    return res.status(400).json({ error: "username is required" });
  }
  const token = issueToken(username.trim());
  res.json({ token, username: username.trim() });
});

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const httpServer = createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: { origin: "*" },
});

io.use(socketAuthMiddleware);

io.on("connection", (socket) => {
  const { username } = socket.data;
  console.log(`${username} connected (${socket.id})`);

  socket.on("join_room", (room, callback) => {
    try {
      if (!room || !room.trim()) {
        callback({ ok: false, error: "room name is required" });
        return;
      }

      socket.join(room);
      addToRoom(room, socket.id, username);

      socket.emit("room_history", getRoomHistory(room));
      io.to(room).emit("presence_update", {
        room,
        onlineUsers: getOnlineUsernames(room),
      });

      callback({ ok: true, data: undefined });
    } catch (err) {
      // never let a handler throw uncaught - always send something
      // back to the client so the UI can show a real error instead
      // of just hanging
      callback({ ok: false, error: "could not join room" });
    }
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
    removeFromRoom(room, socket.id);
    io.to(room).emit("presence_update", {
      room,
      onlineUsers: getOnlineUsernames(room),
    });
  });

  socket.on("send_message", (data, callback) => {
    try {
      const text = data.text?.trim();
      if (!text) {
        callback({ ok: false, error: "message text cannot be empty" });
        return;
      }
      if (!socket.rooms.has(data.room)) {
        callback({ ok: false, error: "you're not in that room" });
        return;
      }

      const message = {
        id: crypto.randomUUID(),
        room: data.room,
        username,
        text,
        createdAt: new Date().toISOString(),
      };

      saveMessage(message);
      io.to(data.room).emit("new_message", message);
      callback({ ok: true, data: message });
    } catch (err) {
      callback({ ok: false, error: "failed to send message" });
    }
  });

  socket.on("typing", (data) => {
    // broadcast (not io.to) so the typer doesn't see their own indicator
    socket.to(data.room).emit("typing_update", {
      room: data.room,
      username,
      isTyping: data.isTyping,
    });
  });

  socket.on("mark_read", (data) => {
    socket.to(data.room).emit("read_receipt", {
      room: data.room,
      messageId: data.messageId,
      username,
    });
  });

  socket.on("disconnect", () => {
    const affectedRooms = removeFromAllRooms(socket.id);
    for (const room of affectedRooms) {
      io.to(room).emit("presence_update", {
        room,
        onlineUsers: getOnlineUsernames(room),
      });
    }
    console.log(`${username} disconnected (${socket.id})`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`chat server running on port ${PORT}`);
});
