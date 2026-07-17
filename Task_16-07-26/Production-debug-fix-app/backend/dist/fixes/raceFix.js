"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawSafe = withdrawSafe;
exports.getBalanceSafe = getBalanceSafe;
const async_mutex_1 = require("async-mutex");
const mutex = new async_mutex_1.Mutex();
let balance = 1000;
async function withdrawSafe(amount) {
    return mutex.runExclusive(() => {
        balance -= amount;
        return balance;
    });
}
function getBalanceSafe() {
    return balance;
}
//# sourceMappingURL=raceFix.js.map