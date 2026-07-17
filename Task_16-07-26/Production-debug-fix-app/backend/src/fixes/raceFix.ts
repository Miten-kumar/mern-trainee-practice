import { Mutex } from "async-mutex";


const mutex = new Mutex();


let balance = 1000;


export async function withdrawSafe(
  amount: number
) {


  return mutex.runExclusive(() => {


    balance -= amount;


    return balance;


  });

}

export function getBalanceSafe() {

  return balance;

}