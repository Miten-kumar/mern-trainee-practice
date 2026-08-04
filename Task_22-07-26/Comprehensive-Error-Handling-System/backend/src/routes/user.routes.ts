import { Router } from "express";

import {

    getUsers,

    getUserById,

    createUser

}
from "../controllers/user.controllers";


const router = Router();

// GET ALL USERS

router.get(
    "/",
    getUsers
);

// GET USER BY ID

router.get(
    "/:id",
    getUserById
);


// CREATE USER

router.post(
    "/",
    createUser
);

export default router;