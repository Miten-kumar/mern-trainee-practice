"use strict";
// src/bugs/raceCondition.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdraw = withdraw;
exports.getBalance = getBalance;
let balance = 1000;
async function withdraw(amount) {
    const currentBalance = balance;
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 500));
    balance = currentBalance - amount;
    return balance;
}
function getBalance() {
    return balance;
}
//# sourceMappingURL=raceCondition.js.map