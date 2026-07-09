import express from "express";
import cors from "cors";
import fs from "fs";
import { UPLOAD_DIR, TMP_DIR } from "./src/config.js";
import simpleUploadRoutes from "./src/routes/simpleUpload.js";
import chunkedUploadRoutes from "./src/routes/chunkedUpload.js";

// make sure the upload folders exist before anything tries to write to them
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(TMP_DIR, { recursive: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

app.use("/api", simpleUploadRoutes);
app.use("/api", chunkedUploadRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`upload backend running on http://localhost:${PORT}`);
});
