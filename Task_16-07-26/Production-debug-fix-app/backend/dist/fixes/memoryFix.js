"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preventMemoryLeak = preventMemoryLeak;
exports.stopMemoryFix = stopMemoryFix;
exports.getCacheSize = getCacheSize;
const cache = new Map();
const MAX_CACHE_SIZE = 100;
let idCounter = 0;
function preventMemoryLeak() {
    const id = ++idCounter;
    cache.set(id, Buffer.alloc(1024 * 1024));
    // Remove oldest item when limit exceeded
    if (cache.size > MAX_CACHE_SIZE) {
        const firstKey = cache.keys().next().value;
        if (firstKey !== undefined) {
            cache.delete(firstKey);
        }
    }
    return cache.size;
}
function stopMemoryFix() {
    cache.clear();
    idCounter = 0;
}
function getCacheSize() {
    return cache.size;
}
//# sourceMappingURL=memoryFix.js.map