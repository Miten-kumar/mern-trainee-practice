const API_BASE = "http://localhost:5000/api";
export const CHUNK_SIZE = 2 * 1024 * 1024; // must match backend config.js

// plain fetch doesn't give upload progress events, so this uses XHR
// just for the simple upload where we want a progress bar
export function uploadFiles(files, onProgress) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_BASE}/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const data = JSON.parse(xhr.responseText || "{}");
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject(new Error(data.error || "upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("network error during upload"));
    xhr.send(formData);
  });
}

async function uploadOneChunk(uploadId, chunkIndex, chunkBlob) {
  const formData = new FormData();
  formData.append("uploadId", uploadId);
  formData.append("chunkIndex", chunkIndex);
  formData.append("chunk", chunkBlob);

  const res = await fetch(`${API_BASE}/upload/chunk`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`chunk ${chunkIndex} failed`);
  }
  return res.json();
}

// retries a single chunk a few times before giving up entirely -
// this is the "error recovery" piece for flaky connections
async function uploadChunkWithRetry(uploadId, chunkIndex, chunkBlob, maxAttempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await uploadOneChunk(uploadId, chunkIndex, chunkBlob);
    } catch (err) {
      lastError = err;
      // wait a bit longer each retry instead of hammering the server
      await new Promise((r) => setTimeout(r, attempt * 500));
    }
  }
  throw lastError;
}

export async function getUploadStatus(uploadId) {
  const res = await fetch(`${API_BASE}/upload/status/${uploadId}`);
  return res.json();
}

// splits the file into CHUNK_SIZE pieces and uploads whichever ones
// aren't already on the server (so calling this again after a failure
// picks up where it left off instead of re-sending everything)
export async function uploadFileInChunks(file, uploadId, onProgress) {
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const { received } = await getUploadStatus(uploadId);
  const alreadyReceived = new Set(received);

  for (let i = 0; i < totalChunks; i++) {
    if (alreadyReceived.has(i)) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100));
      continue;
    }

    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunkBlob = file.slice(start, end);

    await uploadChunkWithRetry(uploadId, i, chunkBlob);
    onProgress(Math.round(((i + 1) / totalChunks) * 100));
  }

  const res = await fetch(`${API_BASE}/upload/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      uploadId,
      fileName: file.name,
      totalChunks,
      mimetype: file.type,
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "could not complete upload");
  }
  return data;
}
