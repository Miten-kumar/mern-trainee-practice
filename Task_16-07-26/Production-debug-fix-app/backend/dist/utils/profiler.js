"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTimer = startTimer;
function startTimer(label) {
    const start = performance.now();
    return function endTimer() {
        const end = performance.now();
        const duration = end - start;
        console.log(`[PROFILE] ${label}: ${duration.toFixed(2)} ms`);
        return duration;
    };
}
//# sourceMappingURL=profiler.js.map