// src/bugs/raceCondition.ts

let balance = 1000;


export async function withdraw(
  amount: number
) {

  const currentBalance = balance;


  // Simulate database delay
  await new Promise(resolve =>
    setTimeout(resolve, 500)
  );


  balance = currentBalance - amount;


  return balance;
}


export function getBalance() {
  return balance;
}