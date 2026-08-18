import { Router } from "express";

import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} from "../../controller/user.controller";

import { validate } from "../../middleware/validate.middleware";

import { createUserSchema } from "../../validators/user.schema";


const router = Router();

// GET ALL USERS
router.get(
    "/",
    getUsers
);

// GET SINGLE USER
router.get(
    "/:id",
    getUserById
);

// CREATE USER
router.post(
    "/",
    validate(createUserSchema),
    createUser
);

// UPDATE USER
router.patch(
    "/:id",
    updateUser
);

// DELETE USER
router.delete(
    "/:id",
    deleteUser
);

export default router;