import { Router, Request, Response } from "express";
import tabs from "../data/tabs";

const router = Router();

/**
 * GET /api/tabs
 * Returns all tabs
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: tabs.length,
    data: tabs,
  });
});

/**
 * GET /api/tabs/:id
 * Returns a single tab
 */
router.get("/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  const tab = tabs.find((item) => item.id === id);

  if (!tab) {
    return res.status(404).json({
      success: false,
      message: "Tab not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: tab,
  });
});

export default router;