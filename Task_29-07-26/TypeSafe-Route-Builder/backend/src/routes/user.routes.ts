import { Router } from "express";
import { fetchUsers, fetchUserById, addUser } from "../controllers/user.controller";


const router =
    Router();

// GET ALL USERS

router.get(
    "/users",
    fetchUsers
);

// GET USER BY ID

router.get(
    "/users/:id",
    fetchUserById
);

// CREATE USER

router.post(
    "/users",
    addUser
);

export default router;