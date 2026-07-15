"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = require("../controller/health.controller");
const router = (0, express_1.Router)();
router.get("/health", health_controller_1.healthCheck);
router.get("/users", (req, res) => {
    let count = 0;
    for (let i = 0; i < 100000; i++) {
        count += i;
    }
    res.json({
        users: [
            "John",
            "Alex"
        ],
        pid: process.pid
    });
});
exports.default = router;
