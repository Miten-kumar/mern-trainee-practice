import { Router } from "express";

import {

    createErrorLog,

    getErrorLogs

}
from "../controllers/error.controllers";

const router = Router();

// SAVE ERROR FROM FRONTEND

router.post(
    "/",
    createErrorLog
);

// GET ERROR LOGS FOR ADMIN

router.get(
    "/",
    getErrorLogs
);

export default router;