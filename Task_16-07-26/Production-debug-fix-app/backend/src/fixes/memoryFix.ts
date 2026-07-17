const cache = new Map<number, Buffer>();

const MAX_CACHE_SIZE = 100;

let idCounter = 0;


export function preventMemoryLeak(): number {

  const id = ++idCounter;

  cache.set(
    id,
    Buffer.alloc(1024 * 1024)
  );

  // Remove oldest item when limit exceeded
  if (cache.size > MAX_CACHE_SIZE) {

    const firstKey =
      cache.keys().next().value as number | undefined;


    if (firstKey !== undefined) {
      cache.delete(firstKey);
    }

  }
  return cache.size;
}

export function stopMemoryFix(): void {

  cache.clear();

  idCounter = 0;

}

export function getCacheSize(): number {

  return cache.size;

}