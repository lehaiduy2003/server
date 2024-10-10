const errorHandler = require("./errorMiddleware");
const { redisClientPromise } = require("../configs/redis");

/**
 * format cache key for preventing NoSQL injection
 * @param {Request} req
 * @returns {string} url|param1:value1|param2:value2|...
 */
const generateCacheKey = (req) => {
  const { originalUrl, params, query } = req;
  const keyParts = [originalUrl];

  for (const [key, value] of Object.entries(params)) {
    keyParts.push(`${key}:${value}`);
  }

  for (const [key, value] of Object.entries(query)) {
    keyParts.push(`${key}:${value}`);
  }

  return keyParts.join("|");
};

const checkCache = async (req, res, next) => {
  try {
    const cacheKey = generateCacheKey(req);
    const redisClient = await redisClientPromise;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached data");
      return res.json(JSON.parse(cachedData));
    }

    // Attach cacheKey to the request object for later use
    req.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error("Error checking cache: ", error);
    errorHandler(error, req, res);
  }
};

const saveToCache = async (key, data) => {
  try {
    const redisClient = await redisClientPromise;
    await redisClient.set(key, JSON.stringify(data), {
      EX: 3600, // Cache for 1 hour
    });
  } catch (error) {
    console.error("Error saving to cache: ", error);
  }
};

module.exports = { checkCache, saveToCache, generateCacheKey };
