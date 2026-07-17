"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateInWorker = calculateInWorker;
const node_worker_threads_1 = require("node:worker_threads");
const node_path_1 = __importDefault(require("node:path"));
function calculateInWorker() {
    return new Promise((resolve, reject) => {
        const worker = new node_worker_threads_1.Worker(node_path_1.default.join(process.cwd(), "src/workers/cpu.worker.ts"));
        worker.on("message", (result) => {
            resolve(result);
            worker.terminate();
        });
        worker.on("error", reject);
    });
}
//# sourceMappingURL=eventLoopFix.js.map