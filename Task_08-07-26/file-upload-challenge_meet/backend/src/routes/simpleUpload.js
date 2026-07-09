import { Router } from "express";
import multer from "multer";
import path from "path";
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES, UPLOAD_DIR } from "../config.js";
import { compressIfImage } from "../utils/imageCompressor.js";

const router = Router();

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(new Error(`file type "${file.mimetype}" is not allowed`));
      return;
    }
    cb(null, true);
  },
});

// accepts up to 10 files in one request, field name "files"
router.post("/upload", upload.array("files", 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "no files uploaded" });
  }

  const results = [];
  for (const file of req.files) {
    const compressed = await compressIfImage(file.path, file.mimetype);
    results.push({
      originalName: file.originalname,
      savedAs: path.basename(compressed.path),
      mimetype: file.mimetype,
      originalSize: file.size,
      finalSize: compressed.size,
    });
  }

  res.json({ uploaded: results });
});

// multer errors (file too big, too many files) need their own handler,
// otherwise they just crash the request with a generic 500
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        error: `file too large, max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
      });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

export default router;
