import redisClient from "../config/redis";

export const setCache = async (
  key: string,
  value: unknown,
  expiry: number = 300
): Promise<void> => {
  await redisClient.set(
    key,
    JSON.stringify(value),
    {
      EX: expiry,
    }
  );
};

export const getCache = async (
  key: string
): Promise<any | null> => {
  const data = await redisClient.get(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};

export const deleteCache = async (
  key: string
): Promise<void> => {
  await redisClient.del(key);
};