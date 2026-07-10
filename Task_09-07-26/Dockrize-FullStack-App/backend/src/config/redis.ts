import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on(
    "Connect",
    () => {
        console.log(" Redis Connected ");
    }
);

redisClient.on(
    "error",
    (error) => {
        console.log(error);
    }
);

export default redisClient;