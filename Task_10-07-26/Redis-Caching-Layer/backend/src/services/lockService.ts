import redisClient from "../config/redis";

export const acquireLock = async (
  key: string
): Promise<boolean> => {

  const result = await redisClient.set(
    key,
    "LOCKED",
    {
      NX: true,
      EX: 10,
    }
  );

  return result === "OK";
};

export const releaseLock = async (
  key: string
): Promise<void> => {

  await redisClient.del(key);
};