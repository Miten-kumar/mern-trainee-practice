"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
const PORT = Number(process.env.PORT || 3000);
const server = app_1.default.listen(PORT, () => {
    logger_1.logger.info(`Server running on port ${PORT}`);
});
// Graceful shutdown
process.on("SIGTERM", () => {
    logger_1.logger.info("SIGTERM received. Closing server...");
    server.close(() => {
        logger_1.logger.info("Server closed");
        process.exit(0);
    });
});
process.on("SIGINT", () => {
    logger_1.logger.info("SIGINT received. Closing server...");
    server.close(() => {
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map