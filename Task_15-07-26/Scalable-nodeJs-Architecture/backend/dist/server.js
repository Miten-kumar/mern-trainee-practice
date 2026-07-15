"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const shutdown_1 = require("./config/shutdown");
const PORT = Number(process.env.PORT) || 3000;
const server = app_1.default.listen(PORT, () => {
    console.log(`
Server running

Port:${PORT}

PID:${process.pid}
`);
});
(0, shutdown_1.gracefulShutdown)(server);
