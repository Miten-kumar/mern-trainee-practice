"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const debug_routes_1 = __importDefault(require("./routes/debug.routes"));
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Request logger
app.use((req, _res, next) => {
    logger_1.logger.info(`${req.method} ${req.url}`);
    next();
});
// Health check
app.get("/health", (_req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime()
    });
});
// Debug routes
app.use("/api", debug_routes_1.default);
// Global error handler
app.use((err, _req, res, _next) => {
    logger_1.logger.error(err.message);
    res.status(500).json({
        message: "Internal Server Error"
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map