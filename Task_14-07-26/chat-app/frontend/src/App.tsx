import { useRef, useState } from "react";
import Login from "./components/Login";
import ChatRoom from "./components/ChatRoom";
import { createSocket, login } from "./socket";
import type { ChatSocket } from "./socket";
import "./App.css";

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState("");
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<ChatSocket | null>(null);

  async function handleLogin(name: string) {
    setConnectionError("");
    try {
      const { token, username: confirmedName } = await login(name);
      const socket = createSocket(token);
      socketRef.current = socket;

      socket.on("connect", () => setConnected(true));

      // socket.io calls this if the auth middleware on the server
      // rejects the connection - shown to the user instead of just
      // silently failing to connect
      socket.on("connect_error", (err) => {
        setConnectionError(err.message);
        setConnected(false);
      });

      socket.on("disconnect", () => setConnected(false));

      socket.connect();
      setUsername(confirmedName);
    } catch (err) {
      setConnectionError(err instanceof Error ? err.message : "login failed");
    }
  }

  if (!username || !socketRef.current) {
    return <Login onLogin={handleLogin} error={connectionError} />;
  }

  if (!connected) {
    return (
      <div className="login-screen">
        <p>{connectionError || "connecting..."}</p>
      </div>
    );
  }

  return <ChatRoom socket={socketRef.current} username={username} />;
}
