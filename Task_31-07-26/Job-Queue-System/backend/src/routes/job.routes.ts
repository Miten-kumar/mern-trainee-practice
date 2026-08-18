import { Router } from "express";

import {
  createEmailJob,
  createImageJob,
  getAllJobs,
  getJobStatus,
} from "../controllers/job.controller";

import upload from "../middleware/upload.middleware";


const router = Router();



router.post(
    "/email",
    createEmailJob
);



router.post(
    "/image",
    upload.single("image"),
    createImageJob
);



router.get(
    "/",
    getAllJobs
);



router.get(
    "/:id",
    getJobStatus
);



export default router;