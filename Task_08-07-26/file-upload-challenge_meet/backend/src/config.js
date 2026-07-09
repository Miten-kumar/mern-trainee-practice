import path from "path";

// simple uploads (single request, whole file at once)
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file

// chunked uploads (large files, sent in pieces)
export const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB per chunk, client should match this
export const MAX_CHUNKED_FILE_SIZE = 100 * 1024 * 1024; // 100MB assembled

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const UPLOAD_DIR = path.join(process.cwd(), "uploads", "final");
export const TMP_DIR = path.join(process.cwd(), "uploads", "tmp");
