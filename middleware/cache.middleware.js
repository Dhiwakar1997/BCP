const redisClient = require("../config/redis.config");

const CacheMiddleware =
  (keygen, expiry = 3600) =>
  async (req, res, next) => {
    const cacheKey = keygen(req);
    console.log(cacheKey);
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    const orgResponse = res.json.bind(res);
    console.log(orgResponse);
    res.json = (data) => {
      redisClient.set(cacheKey, JSON.stringify(data), { EX: expiry });
      return orgResponse(data);
    };
    next();
  };

module.exports = CacheMiddleware;
