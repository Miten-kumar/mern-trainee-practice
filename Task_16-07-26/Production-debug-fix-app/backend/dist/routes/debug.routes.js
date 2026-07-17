"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eventLoop_1 = require("../bugs/eventLoop");
const raceCondition_1 = require("../bugs/raceCondition");
const memoryFix_1 = require("../fixes/memoryFix");
const eventLoopFix_1 = require("../fixes/eventLoopFix");
const raceFix_1 = require("../fixes/raceFix");
const memoryLeak_1 = require("../bugs/memoryLeak");
const router = (0, express_1.Router)();
// =======================
// BUG ROUTES
// =======================
// Memory leak simulation
router.get("/bug/memory", (_, res) => {
    (0, memoryLeak_1.createMemoryLeak)();
    res.json({
        message: "Memory leak started"
    });
});
// Event loop blocking simulation
router.get("/bug/cpu", (_, res) => {
    const result = (0, eventLoop_1.blockEventLoop)();
    res.json({
        result
    });
});
// Race condition simulation
router.post("/bug/withdraw/:amount", async (req, res) => {
    const amount = Number(req.params.amount);
    const result = await (0, raceCondition_1.withdraw)(amount);
    res.json({
        balance: result
    });
});
router.get("/bug/balance", (_, res) => {
    res.json({
        balance: (0, raceCondition_1.getBalance)()
    });
});
// =======================
// FIXED ROUTES
// =======================
// Memory leak fixed
router.get("/fix/memory", (_, res) => {
    const size = (0, memoryFix_1.preventMemoryLeak)();
    res.json({
        message: "Memory leak fixed version running",
        cacheSize: size
    });
});
// Event loop fixed
router.get("/fix/cpu", async (_, res) => {
    const result = await (0, eventLoopFix_1.calculateInWorker)();
    res.json({
        result
    });
});
// Race condition fixed
router.post("/fix/withdraw/:amount", async (req, res) => {
    const amount = Number(req.params.amount);
    const result = await (0, raceFix_1.withdrawSafe)(amount);
    res.json({
        balance: result
    });
});
router.get("/fix/balance", (_, res) => {
    res.json({
        balance: (0, raceFix_1.getBalanceSafe)()
    });
});
exports.default = router;
//# sourceMappingURL=debug.routes.js.map