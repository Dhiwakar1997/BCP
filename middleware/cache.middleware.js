// will be adding the redis cache for user auth, key validation and api limit validation
const redisClient = require("../config/redis.config");

const CacheMiddleware =
  (keygen, expiry = 3600) =>
  async (req, res, next) => {
    const cacheKey = keygen(req);
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData));
    }
    const orgResponse = res.json.bind(res);
    res.json = (data) => {
      redisClient.set(cacheKey, JSON.stringify(data), { EX: expiry });
      return orgResponse(data);
    };
    next();
  };

module.exports = CacheMiddleware;
