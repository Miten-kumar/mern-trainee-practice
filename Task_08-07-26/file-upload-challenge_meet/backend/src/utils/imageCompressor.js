import sharp from "sharp";
import fs from "fs/promises";
import { IMAGE_MIME_TYPES } from "../config.js";

// resizes down (if too big) and re-encodes at a lower quality.
// keeps the original format instead of forcing everything to jpeg,
// since converting a png with transparency to jpeg would just break it
export async function compressIfImage(filePath, mimetype) {
  if (!IMAGE_MIME_TYPES.includes(mimetype)) {
    const stat = await fs.stat(filePath);
    return { path: filePath, size: stat.size };
  }

  const compressedPath = filePath.replace(/(\.[^.]+)$/, "-compressed$1");
  let pipeline = sharp(filePath).resize({ width: 1920, withoutEnlargement: true });

  if (mimetype === "image/jpeg") {
    pipeline = pipeline.jpeg({ quality: 75 });
  } else if (mimetype === "image/png") {
    pipeline = pipeline.png({ quality: 75, compressionLevel: 8 });
  } else if (mimetype === "image/webp") {
    pipeline = pipeline.webp({ quality: 75 });
  }

  await pipeline.toFile(compressedPath);
  await fs.unlink(filePath); // don't keep the uncompressed original around

  const stat = await fs.stat(compressedPath);
  return { path: compressedPath, size: stat.size };
}
