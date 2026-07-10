"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL
});
redisClient.on("Connect", () => {
    console.log(" Redis Connected ");
});
redisClient.on("error", (error) => {
    console.log(error);
});
exports.default = redisClient;
