"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    console.error("Error:", err.message);
    const statusCode = err.statusCode || 500;
    res.status(statusCode)
        .json({
        success: false,
        message: err.message || "Internal Server Error",
        statusCode,
        timestamp: new Date().toISOString()
    });
};
exports.errorMiddleware = errorMiddleware;
