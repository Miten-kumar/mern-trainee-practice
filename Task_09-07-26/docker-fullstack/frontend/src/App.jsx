import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadNotes() {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data.notes);
      setSource(data.source);
    } catch (err) {
      setError("could not reach the backend - is it running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      setText("");
      await loadNotes();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <h1>Notes</h1>
      <p className="hint">
        backend + postgres + redis, running in docker.
        {source && ` last list came from: ${source}`}
      </p>

      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="write a note..."
        />
        <button type="submit">Add</button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p>loading...</p>
      ) : (
        <ul className="notes-list">
          {notes.map((n) => (
            <li key={n.id}>{n.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
