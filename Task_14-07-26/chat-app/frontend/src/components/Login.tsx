import { useState } from "react";
import type { FormEvent } from "react";

interface LoginProps {
  onLogin: (username: string) => void;
  error: string;
}

export default function Login({ onLogin, error }: LoginProps) {
  const [username, setUsername] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim()) return;
    onLogin(username.trim());
  }

  return (
    <div className="login-screen">
      <form onSubmit={handleSubmit}>
        <h1>Chat</h1>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="pick a username"
          autoFocus
        />
        <button type="submit">Join</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
