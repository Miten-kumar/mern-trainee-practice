import { Router } from "express";

import { accessibilityController } from "../controllers/accessibility.controller.js";

import { validate } from "../middleware/validation.middleware.js";

import {
  accessibilityPreferencesSchema,
} from "../schemas/accessibility.schema.js";

const router = Router();

router.get(
  "/preferences",
  accessibilityController.getPreferences
);

router.put(
  "/preferences",
  validate(accessibilityPreferencesSchema),
  accessibilityController.updatePreferences
);

export default router;