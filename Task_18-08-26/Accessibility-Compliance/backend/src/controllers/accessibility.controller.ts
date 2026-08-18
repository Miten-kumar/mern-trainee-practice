import type { Request, Response, NextFunction } from "express";

import { accessibilityService } from "../services/accessibility.service.js";

class AccessibilityController {
  /**
   * GET /api/v1/accessibility/preferences
   *
   * Returns the current accessibility preferences.
   */
  async getPreferences(
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const preferences =
        await accessibilityService.getPreferences();

      res.status(200).json({
        success: true,
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/accessibility/preferences
   *
   * Updates accessibility preferences.
   */
  async updatePreferences(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const preferences =
        await accessibilityService.updatePreferences(req.body);

      res.status(200).json({
        success: true,
        message: "Accessibility preferences updated successfully",
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const accessibilityController =
  new AccessibilityController();