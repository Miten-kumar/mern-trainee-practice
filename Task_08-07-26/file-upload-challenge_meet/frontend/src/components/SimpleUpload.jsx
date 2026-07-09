import { useState } from "react";
import { uploadFiles } from "../api.js";

const MAX_SIZE_MB = 10;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];

export default function SimpleUpload() {
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | done | error
  const [results, setResults] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  function handleFileSelect(e) {
    const selected = Array.from(e.target.files);

    // catch obvious problems before even hitting the network,
    // the server still double-checks this too
    const badFile = selected.find(
      (f) => !ALLOWED_TYPES.includes(f.type) || f.size > MAX_SIZE_MB * 1024 * 1024
    );

    if (badFile) {
      setErrorMsg(`"${badFile.name}" is either too big or not an allowed file type`);
      setFiles([]);
      return;
    }

    setErrorMsg("");
    setFiles(selected);
    setStatus("idle");
    setResults([]);
  }

  async function handleUpload() {
    if (files.length === 0) return;
    setStatus("uploading");
    setProgress(0);
    setErrorMsg("");

    try {
      const data = await uploadFiles(files, setProgress);
      setResults(data.uploaded);
      setStatus("done");
    } catch (err) {
      setErrorMsg(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="upload-box">
      <h2>Simple Upload (multiple files)</h2>
      <p className="hint">Images, gifs and PDFs only, max {MAX_SIZE_MB}MB each.</p>

      <input type="file" multiple onChange={handleFileSelect} />

      {errorMsg && <p className="error">{errorMsg}</p>}

      {files.length > 0 && (
        <button onClick={handleUpload} disabled={status === "uploading"}>
          {status === "uploading" ? "Uploading..." : `Upload ${files.length} file(s)`}
        </button>
      )}

      {status === "uploading" && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      )}

      {status === "done" && (
        <ul className="results">
          {results.map((r) => (
            <li key={r.savedAs}>
              {r.originalName} — {(r.originalSize / 1024).toFixed(0)}KB →{" "}
              {(r.finalSize / 1024).toFixed(0)}KB
              {r.finalSize < r.originalSize &&
                ` (compressed ${Math.round((1 - r.finalSize / r.originalSize) * 100)}%)`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
