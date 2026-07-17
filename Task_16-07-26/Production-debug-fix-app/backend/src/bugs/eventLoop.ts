
export function blockEventLoop(): number {

  let total = 0;

  for (let i = 0; i < 5_000_000_000; i++) {
    total += i;
  }

  return total;
}