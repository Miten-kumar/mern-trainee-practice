import { redisClient } from "../redisClient.js";

const LOCK_TTL_MS = 5000; // lock auto-expires so a crashed request can't block forever
const LOCK_WAIT_MS = 100;
const MAX_WAIT_ATTEMPTS = 30; // ~3 seconds max wait before giving up on the lock

// reads from cache if present. on a miss, only ONE caller actually runs
// fetchFn() and rebuilds the cache - everyone else who misses at the
// same time just waits for that first one to finish, instead of every
// request hammering the "database" at once (that's the stampede)
export async function getOrSetCache(key, fetchFn, ttlSeconds) {
  const cached = await redisClient.get(key);
  if (cached) return { data: JSON.parse(cached), fromCache: true };

  const lockKey = `lock:${key}`;
  const gotLock = await redisClient.set(lockKey, "1", { NX: true, PX: LOCK_TTL_MS });

  if (gotLock) {
    try {
      const data = await fetchFn();
      await redisClient.set(key, JSON.stringify(data), { EX: ttlSeconds });
      return { data, fromCache: false };
    } finally {
      await redisClient.del(lockKey);
    }
  }

  // didn't get the lock - someone else is already rebuilding the cache,
  // so just poll until they finish instead of also querying the db
  for (let i = 0; i < MAX_WAIT_ATTEMPTS; i++) {
    await new Promise((resolve) => setTimeout(resolve, LOCK_WAIT_MS));
    const nowCached = await redisClient.get(key);
    if (nowCached) return { data: JSON.parse(nowCached), fromCache: true };
  }

  // whoever held the lock took too long (or crashed) - fall back to
  // fetching it ourselves rather than waiting forever
  const data = await fetchFn();
  return { data, fromCache: false };
}

export async function invalidateCache(key) {
  await redisClient.del(key);
}
