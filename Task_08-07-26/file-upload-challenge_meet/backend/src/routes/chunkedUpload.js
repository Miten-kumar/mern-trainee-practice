import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import {
  MAX_CHUNKED_FILE_SIZE,
  ALLOWED_MIME_TYPES,
  UPLOAD_DIR,
} from "../config.js";
import { saveChunk, getReceivedChunks, assembleChunks, discardUpload } from "../utils/chunkManager.js";
import { compressIfImage } from "../utils/imageCompressor.js";

const router = Router();

// chunks are small (2MB), memory storage is fine, we write them
// to disk ourselves in chunkManager
const chunkUpload = multer({ storage: multer.memoryStorage() });

// client calls this before starting (or after a page refresh) to find
// out which chunks it already sent, so it doesn't have to resend them
router.get("/upload/status/:uploadId", async (req, res) => {
  const received = await getReceivedChunks(req.params.uploadId);
  res.json({ received });
});

router.post("/upload/chunk", chunkUpload.single("chunk"), async (req, res) => {
  const { uploadId, chunkIndex } = req.body;

  if (!uploadId || chunkIndex === undefined || !req.file) {
    return res.status(400).json({ error: "uploadId, chunkIndex and chunk file are required" });
  }

  try {
    await saveChunk(uploadId, Number(chunkIndex), req.file.buffer);
    const received = await getReceivedChunks(uploadId);
    res.json({ received });
  } catch (err) {
    res.status(500).json({ error: "failed to save chunk, try again" });
  }
});

router.post("/upload/complete", async (req, res) => {
  const { uploadId, fileName, totalChunks, mimetype } = req.body;

  if (!uploadId || !fileName || !totalChunks) {
    return res.status(400).json({ error: "uploadId, fileName and totalChunks are required" });
  }

  if (mimetype && !ALLOWED_MIME_TYPES.includes(mimetype)) {
    await discardUpload(uploadId);
    return res.status(400).json({ error: `file type "${mimetype}" is not allowed` });
  }

  const received = await getReceivedChunks(uploadId);
  if (received.length !== Number(totalChunks)) {
    // don't fail permanently here - tell the client exactly what's missing
    // so it can just send those chunks and call /complete again
    return res.status(409).json({
      error: "upload incomplete, some chunks are missing",
      received,
      expected: Number(totalChunks),
    });
  }

  const ext = path.extname(fileName);
  const finalName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const finalPath = path.join(UPLOAD_DIR, finalName);

  try {
    await assembleChunks(uploadId, Number(totalChunks), finalPath);
  } catch (err) {
    return res.status(500).json({ error: "failed to assemble file from chunks" });
  }

  const stat = await fs.stat(finalPath);
  if (stat.size > MAX_CHUNKED_FILE_SIZE) {
    await fs.unlink(finalPath);
    return res.status(413).json({
      error: `assembled file is too large, max is ${MAX_CHUNKED_FILE_SIZE / (1024 * 1024)}MB`,
    });
  }

  const compressed = await compressIfImage(finalPath, mimetype);

  res.json({
    fileName,
    savedAs: path.basename(compressed.path),
    size: compressed.size,
  });
});

router.delete("/upload/:uploadId", async (req, res) => {
  await discardUpload(req.params.uploadId);
  res.json({ discarded: true });
});

export default router;
