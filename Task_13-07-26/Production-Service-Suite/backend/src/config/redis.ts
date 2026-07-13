import { createClient } from "redis";
import { env } from "./env";


export const redisClient = createClient({

  url: env.REDIS_URL

});


redisClient.on(
  "connect",
  () => {

    console.log(
      "Redis connecting..."
    );

  }
);


redisClient.on(
  "ready",
  () => {

    console.log(
      "Redis ready"
    );

  }
);


redisClient.on(
  "error",
  (error) => {

    console.error(
      "Redis error:",
      error
    );

  }
);



export async function connectRedis(){

  if (!redisClient.isOpen) {

    await redisClient.connect();

  }

}