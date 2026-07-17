// memoryLeak.ts

const users: Buffer[] = [];

let intervalId: NodeJS.Timeout | null = null;

export function createMemoryLeak(interval = 1000): void {
  // Prevent multiple intervals
  if (intervalId !== null) {
    return;
  }

  intervalId = setInterval(() => {
    users.push(
      Buffer.alloc(1024 * 1024) // Allocate 1 MB
    );

  }, interval);
}


export function stopMemoryLeak(): void {
  // Clear running interval
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }

  // Release references so garbage collection can clean memory
  users.length = 0;
}


export function getStoredObjectCount(): number {
  return users.length;
}


export function getAllocatedMemorySize(): number {
  return users.length * 1024 * 1024;
}