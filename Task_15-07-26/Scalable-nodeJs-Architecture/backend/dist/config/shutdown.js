"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gracefulShutdown = gracefulShutdown;
function gracefulShutdown(server) {
    const shutdown = () => {
        console.log("Shutdown signal received");
        server.close(() => {
            console.log("HTTP server closed");
            process.exit(0);
        });
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
}
