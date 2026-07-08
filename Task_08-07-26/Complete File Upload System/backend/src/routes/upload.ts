import { Router, type Request, type Response } from "express";
import fs from "fs";
import path from "path";

import upload from "../middleware/upload.js";
import { validateFile } from "../middleware/validateFile.js";
import compressImage from "../utils/compressImage.js";

const router = Router();

/*
   Upload Multiple Files
*/

router.post(
  "/",
  upload.array("files", 10),
  validateFile,
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No files uploaded.",
        });
      }

      const uploadedFiles = [];

      for (const file of files) {
        let filePath = file.path;

        // Compress only images
        if (file.mimetype.startsWith("image/")) {
          try {
            filePath = await compressImage(file.path);
          } catch (err) {
            console.error("Image Compression Error:", err);
          }
        }

        uploadedFiles.push({
          originalName: file.originalname,
          fileName: path.basename(filePath),
          size: file.size,
          type: file.mimetype,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Files uploaded successfully.",
        files: uploadedFiles,
      });
    } catch (error) {
      console.error("Upload Error:", error);

      return res.status(500).json({
        success: false,
        message: "Upload failed.",
        error: error instanceof Error ? error.message : "Unknown Error",
      });
    }
  }
);

/*
   Chunk Upload
*/

router.post("/chunk", (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Chunk uploaded successfully.",
  });
});

/*
   Get Uploaded Files
*/

router.get("/", (req: Request, res: Response) => {
  try {
    const uploadFolder = path.join(process.cwd(), "src/uploads");

    if (!fs.existsSync(uploadFolder)) {
      return res.status(200).json({
        success: true,
        files: [],
      });
    }

    const files = fs.readdirSync(uploadFolder);

    const fileList = files.map((file, index) => ({
      id: index + 1,
      name: file,
    }));

    return res.status(200).json({
      success: true,
      files: fileList,
    });
  } catch (error) {
    console.error("Read Files Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch uploaded files.",
    });
  }
});

export default router;