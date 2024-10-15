import { createClient, RedisClientType } from "redis";
import dotenv from "dotenv";
dotenv.config();

async function connectToRedis(): Promise<RedisClientType> {
  try {
    const redisClient: RedisClientType = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    });
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to connect to redis");
  }
}

const redisClientPromise = connectToRedis();

async function closeRedis() {
  if (redisClientPromise) {
    (await redisClientPromise).quit();
  }
}

export { redisClientPromise, closeRedis };
