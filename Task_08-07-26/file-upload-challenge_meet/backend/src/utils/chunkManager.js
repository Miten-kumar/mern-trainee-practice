import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { TMP_DIR } from "../config.js";

function chunkDir(uploadId) {
  // uploadId comes from the client, strip anything that isn't safe for a folder name
  const safeId = String(uploadId).replace(/[^a-zA-Z0-9_-]/g, "");
  return path.join(TMP_DIR, safeId);
}

export async function saveChunk(uploadId, chunkIndex, buffer) {
  const dir = chunkDir(uploadId);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, `chunk-${chunkIndex}`), buffer);
}

// tells the client which chunks already made it to disk, so on a retry
// or a page refresh it only has to send the chunks that are missing
export async function getReceivedChunks(uploadId) {
  const dir = chunkDir(uploadId);
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.startsWith("chunk-"))
      .map((f) => Number(f.replace("chunk-", "")))
      .sort((a, b) => a - b);
  } catch {
    return [];
  }
}

export async function assembleChunks(uploadId, totalChunks, outputPath) {
  const dir = chunkDir(uploadId);
  const writeStream = fsSync.createWriteStream(outputPath);

  for (let i = 0; i < totalChunks; i++) {
    const chunkPath = path.join(dir, `chunk-${i}`);
    const data = await fs.readFile(chunkPath);
    const canContinue = writeStream.write(data);
    if (!canContinue) {
      await new Promise((resolve) => writeStream.once("drain", resolve));
    }
  }

  await new Promise((resolve, reject) => {
    writeStream.end();
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  await fs.rm(dir, { recursive: true, force: true });
}

export async function discardUpload(uploadId) {
  const dir = chunkDir(uploadId);
  await fs.rm(dir, { recursive: true, force: true });
}
