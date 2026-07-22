import { Router } from "express";

import upload from "../middleware/upload.js";

import {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} from "../controllers/form.controller.js";


const router = Router();



// Create Application

router.post(

  "/",

  upload.fields([

    {
      name: "resume",
      maxCount: 1
    },

    {
      name: "profileImage",
      maxCount: 1
    }

  ]),

  createApplication

);



// Get All Applications

router.get(
  "/",
  getApplications
);



// Get Single Application

router.get(
  "/:id",
  getApplicationById
);



// Update Application

router.put(
  "/:id",
  updateApplication
);



// Delete Application

router.delete(
  "/:id",
  deleteApplication
);



export default router;