"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_worker_threads_1 = require("node:worker_threads");
let total = 0;
for (let i = 0; i < 5_000_000_000; i++) {
    total += i;
}
node_worker_threads_1.parentPort?.postMessage(total);
//# sourceMappingURL=cpu.worker.js.map