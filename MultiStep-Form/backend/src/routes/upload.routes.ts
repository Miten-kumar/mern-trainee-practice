import { Router } from "express";

import upload from "../middleware/upload.js";

import {
  uploadResume,
  uploadProfileImage
} from "../controllers/upload.controller.js";


const router = Router();


// Resume Upload
router.post(
  "/resume",
  upload.single("resume"),
  uploadResume
);


// Profile Image Upload
router.post(
  "/profile-image",
  upload.single("image"),
  uploadProfileImage
);


export default router;