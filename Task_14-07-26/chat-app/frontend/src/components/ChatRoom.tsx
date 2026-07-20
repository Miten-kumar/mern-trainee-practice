import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { ChatSocket } from "../socket";
import type { Message } from "../types";

interface ChatRoomProps {
  socket: ChatSocket;
  username: string;
}

// single fixed room keeps this small - the server already supports any
// room name, a room picker would just be a text input calling join_room
// with a different string
const ROOM = "general";
const TYPING_STOP_DELAY = 1500;

export default function ChatRoom({ socket, username }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [readBy, setReadBy] = useState<Record<string, Set<string>>>({});
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // tracks which message ids we've already sent a mark_read for, so we
  // don't spam the server every time this component re-renders
  const markedReadRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    socket.emit("join_room", ROOM, (res) => {
      if (!res.ok) setError(res.error);
    });

    socket.on("room_history", (history) => setMessages(history));
    socket.on("new_message", (message) => setMessages((prev) => [...prev, message]));

    socket.on("presence_update", (data) => {
      if (data.room === ROOM) setOnlineUsers(data.onlineUsers);
    });

    socket.on("typing_update", (data) => {
      if (data.room !== ROOM || data.username === username) return;
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (data.isTyping) next.add(data.username);
        else next.delete(data.username);
        return next;
      });
    });

    socket.on("read_receipt", (data) => {
      if (data.room !== ROOM) return;
      setReadBy((prev) => {
        const existing = prev[data.messageId] ?? new Set<string>();
        return { ...prev, [data.messageId]: new Set(existing).add(data.username) };
      });
    });

    socket.on("error_message", (data) => setError(data.message));

    return () => {
      socket.off("room_history");
      socket.off("new_message");
      socket.off("presence_update");
      socket.off("typing_update");
      socket.off("read_receipt");
      socket.off("error_message");
      socket.emit("leave_room", ROOM);
    };
  }, [socket, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // mark other people's messages as read once they show up in the list
  useEffect(() => {
    for (const msg of messages) {
      if (msg.username !== username && !markedReadRef.current.has(msg.id)) {
        markedReadRef.current.add(msg.id);
        socket.emit("mark_read", { room: ROOM, messageId: msg.id });
      }
    }
  }, [messages, socket, username]);

  function handleTextChange(value: string) {
    setText(value);
    socket.emit("typing", { room: ROOM, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { room: ROOM, isTyping: false });
    }, TYPING_STOP_DELAY);
  }

  function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("send_message", { room: ROOM, text }, (res) => {
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setText("");
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socket.emit("typing", { room: ROOM, isTyping: false });
    });
  }

  return (
    <div className="chat-room">
      <aside className="sidebar">
        <h3>Online ({onlineUsers.length})</h3>
        <ul>
          {onlineUsers.map((u) => (
            <li key={u}>{u === username ? `${u} (you)` : u}</li>
          ))}
        </ul>
      </aside>

      <main className="chat-main">
        {error && <p className="error">{error}</p>}

        <div className="messages">
          {messages.map((msg) => {
            const seenBy = readBy[msg.id];
            return (
              <div key={msg.id} className={`message ${msg.username === username ? "own" : ""}`}>
                <span className="message-author">{msg.username}</span>
                <span className="message-text">{msg.text}</span>
                {msg.username === username && seenBy && seenBy.size > 0 && (
                  <span className="read-receipt">seen by {[...seenBy].join(", ")}</span>
                )}
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {typingUsers.size > 0 && (
          <p className="typing-indicator">
            {[...typingUsers].join(", ")} {typingUsers.size === 1 ? "is" : "are"} typing...
          </p>
        )}

        <form onSubmit={handleSend} className="message-form">
          <input
            value={text}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}
