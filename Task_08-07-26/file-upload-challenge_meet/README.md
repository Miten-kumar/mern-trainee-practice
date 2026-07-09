# Complete File Upload System

File upload API with multi-file support, type/size validation, image
compression, progress tracking, chunked uploads for large files, and
error recovery (resume after a failed/dropped chunk).

## Structure

```
backend/
  server.js              - express app, mounts both upload routers
  src/
    config.js             - size limits, allowed types, chunk size
    routes/
      simpleUpload.js      - single-request multi-file upload
      chunkedUpload.js      - chunk/status/complete/cancel endpoints
    utils/
      imageCompressor.js    - sharp-based resize + re-encode
      chunkManager.js        - saves/reads/reassembles chunks on disk
frontend/
  src/
    api.js                 - fetch/XHR helpers for both upload flows
    components/
      SimpleUpload.jsx       - multi-file picker with progress bar
      ChunkedUpload.jsx       - large file picker, chunked + resumable
```

## Running it

```
cd backend
npm install
npm start
# http://localhost:5000

cd frontend
npm install
npm run dev
# http://localhost:5173
```

## How each requirement was implemented

**Multiple file support**
`POST /api/upload` accepts up to 10 files in one request (`multer.array`),
processes each one and returns per-file results.

**File type validation**
`multer`'s `fileFilter` checks mimetype against an allow-list (jpeg, png,
webp, gif, pdf) before the file is even written to disk. The chunked
upload path checks the same allow-list at `/complete`, since with
chunking you don't know the full file until it's reassembled.

**Size limits**
`multer`'s `limits.fileSize` rejects oversized files for the simple
upload (10MB). For chunked uploads, the assembled file size is checked
against a separate, larger limit (100MB) after reassembly, since large
files are the whole point of the chunked path.

**Image compression**
`utils/imageCompressor.js` uses `sharp` to resize down to max 1920px wide
and re-encode at ~75% quality, keeping the original format so PNGs with
transparency don't get broken by a forced JPEG conversion. Runs after
both the simple and chunked upload paths.

**Progress tracking**
- Simple upload uses `XMLHttpRequest` (not `fetch`, which has no upload
  progress event) and listens to `xhr.upload.onprogress`.
- Chunked upload reports progress as `chunksUploaded / totalChunks`
  after each chunk finishes, which is naturally granular for large files.

**Chunked uploads for large files**
The frontend splits a file into 2MB pieces (`file.slice()`) and POSTs
them one at a time to `/api/upload/chunk` with an `uploadId` and
`chunkIndex`. The backend writes each chunk to
`uploads/tmp/<uploadId>/chunk-<index>`. Once every chunk has arrived,
`/api/upload/complete` streams them back together in order into the
final file and deletes the temp folder. Verified with a checksum test —
the reassembled file is byte-identical to the original.

**Error recovery**
- Per-chunk: if a chunk request fails, the client retries it up to 3
  times with a short backoff before giving up.
- Whole-upload: `GET /api/upload/status/:uploadId` tells the client
  which chunks already made it to the server. The upload function
  checks this first and skips chunks that are already there — so if the
  upload gets interrupted (tab closed, wifi drops) and the person clicks
  Upload again on the same file, it picks up from where it stopped
  instead of re-sending the whole thing. The `uploadId` is kept in
  `localStorage` keyed by filename+size specifically so this survives a
  page refresh.

## Manually verifying it

- Upload a couple of large images through Simple Upload — the result
  list shows original size vs compressed size per file
- Try uploading a `.exe` or a file over 10MB — gets a clear error instead
  of a generic failure
- Upload a large file (\>10MB) through Chunked Upload and watch the
  progress bar move chunk by chunk
- To see resume working: start a chunked upload, refresh the page
  mid-upload, pick the same file again and click Upload — it'll skip
  straight to wherever it left off (check the Network tab, you'll see
  fewer chunk requests than `totalChunks`)
