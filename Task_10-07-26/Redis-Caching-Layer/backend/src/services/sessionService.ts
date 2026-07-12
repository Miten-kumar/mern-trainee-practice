import redisClient from "../config/redis";
import redisKeys from "../utils/redisKeys";

export interface SessionData {
  userId: number;
  email?: string;
  role?: string;
}

export const createSession = async (
  sessionId: string,
  session: SessionData,
  expiry: number = 3600
): Promise<void> => {

  await redisClient.set(
    redisKeys.SESSION(sessionId),
    JSON.stringify(session),
    {
      EX: expiry,
    }
  );
};

export const getSession = async (
  sessionId: string
): Promise<SessionData | null> => {

  const session = await redisClient.get(
    redisKeys.SESSION(sessionId)
  );

  if (!session) {
    return null;
  }

  return JSON.parse(session);
};

export const deleteSession = async (
  sessionId: string
): Promise<void> => {

  await redisClient.del(
    redisKeys.SESSION(sessionId)
  );
};

export const extendSession = async (
  sessionId: string,
  expiry: number = 3600
): Promise<void> => {

  await redisClient.expire(
    redisKeys.SESSION(sessionId),
    expiry
  );
};