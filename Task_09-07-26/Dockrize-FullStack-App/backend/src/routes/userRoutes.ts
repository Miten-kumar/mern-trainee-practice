import { Router } from "express";
import { fetchUser } from "../controllers/userController";

const router = Router();

router.get("/", fetchUser);

export default router;