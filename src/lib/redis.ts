import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
    throw new Error("Please provide REDIS_URL in the environment variables");
}

export const redis = createClient({
    url: REDIS_URL,
});

redis.on("error", (error) => {
    console.error("REDIS ERROR:", error);
});

export const connectRedis = async () => {
    if (redis.isOpen) {
        return redis;
    }

    await redis.connect();
    console.log("REDIS CONNECTED");
    return redis;
};
