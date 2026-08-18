import { Router } from "express";
import { getImages } from "../controllers/image.controller";
import { transformImage } from "../controllers/transform.controller";


const router = Router();

// GET gallery metadata

// /api/images

router.get(

"/",

getImages

);

// GET optimized image

// /api/images/:id/transform?w=640&fmt=webp

router.get(

"/:id/transform",

transformImage

);

export default router;