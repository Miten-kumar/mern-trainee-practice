"use strict";
// memoryLeak.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMemoryLeak = createMemoryLeak;
exports.stopMemoryLeak = stopMemoryLeak;
exports.getStoredObjectCount = getStoredObjectCount;
exports.getAllocatedMemorySize = getAllocatedMemorySize;
const users = [];
let intervalId = null;
function createMemoryLeak(interval = 1000) {
    // Prevent multiple intervals
    if (intervalId !== null) {
        return;
    }
    intervalId = setInterval(() => {
        users.push(Buffer.alloc(1024 * 1024) // Allocate 1 MB
        );
    }, interval);
}
function stopMemoryLeak() {
    // Clear running interval
    if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
    }
    // Release references so garbage collection can clean memory
    users.length = 0;
}
function getStoredObjectCount() {
    return users.length;
}
function getAllocatedMemorySize() {
    return users.length * 1024 * 1024;
}
//# sourceMappingURL=memoryLeak.js.map