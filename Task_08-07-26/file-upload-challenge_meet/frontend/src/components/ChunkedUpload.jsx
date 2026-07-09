import { useState } from "react";
import { uploadFileInChunks, CHUNK_SIZE } from "../api.js";

// same file (by name+size) always gets the same uploadId, so if the
// page gets refreshed mid-upload, clicking upload again resumes instead
// of starting over from zero
function getUploadId(file) {
  const key = `upload-id:${file.name}:${file.size}`;
  let id = localStorage.getItem(key);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

export default function ChunkedUpload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const totalChunks = file ? Math.ceil(file.size / CHUNK_SIZE) : 0;

  function handleFileSelect(e) {
    const selected = e.target.files[0];
    setFile(selected || null);
    setStatus("idle");
    setResult(null);
    setErrorMsg("");
    setProgress(0);
  }

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setErrorMsg("");

    const uploadId = getUploadId(file);

    try {
      const data = await uploadFileInChunks(file, uploadId, setProgress);
      setResult(data);
      setStatus("done");
      localStorage.removeItem(`upload-id:${file.name}:${file.size}`);
    } catch (err) {
      // don't clear the uploadId here - that's what lets a retry
      // resume from wherever it stopped instead of starting over
      setErrorMsg(`${err.message} — click Upload again to resume from where it stopped`);
      setStatus("error");
    }
  }

  return (
    <div className="upload-box">
      <h2>Chunked Upload (large files)</h2>
      <p className="hint">
        File is split into {(CHUNK_SIZE / 1024 / 1024).toFixed(0)}MB chunks and sent one at a
        time. If a chunk fails it retries automatically; if the whole upload gets interrupted,
        clicking Upload again resumes instead of restarting.
      </p>

      <input type="file" onChange={handleFileSelect} />

      {file && (
        <p className="hint">
          {file.name} — {(file.size / 1024 / 1024).toFixed(1)}MB, {totalChunks} chunk(s)
        </p>
      )}

      {file && (
        <button onClick={handleUpload} disabled={status === "uploading"}>
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>
      )}

      {errorMsg && <p className="error">{errorMsg}</p>}

      {(status === "uploading" || status === "error") && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      )}

      {status === "done" && result && (
        <p className="success">
          Done — saved as {result.savedAs} ({(result.size / 1024 / 1024).toFixed(2)}MB)
        </p>
      )}
    </div>
  );
}
