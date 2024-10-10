const { createClient } = require("redis");
require("dotenv").config();

async function connectToRedis() {
  try {
    const redisClient = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
      },
    });
    redisClient.on("error", (error) => console.error(`Error : ${error}`));
    await redisClient.connect();
    return redisClient;
  } catch (error) {
    console.error(error);
  }
}

const redisClientPromise = connectToRedis();

async function closeRedis() {
  if (redisClientPromise) {
    await redisClientPromise.quit();
  }
}

module.exports = { redisClientPromise, closeRedis };
