import { Router, Request, Response } from "express";
import items from "../data/items";

const router = Router();

// GET all items
router.get("/", (req: Request, res: Response) => {
  const search = (req.query.search as string)?.toLowerCase() || "";

  if (search) {
    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(search)
    );

    return res.json(filteredItems);
  }

  return res.json(items);
});

export default router;