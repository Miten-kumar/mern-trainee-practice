"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockEventLoop = blockEventLoop;
function blockEventLoop() {
    let total = 0;
    for (let i = 0; i < 5_000_000_000; i++) {
        total += i;
    }
    return total;
}
//# sourceMappingURL=eventLoop.js.map