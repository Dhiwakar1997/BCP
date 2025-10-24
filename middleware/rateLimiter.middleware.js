const redisClient = require("../config/redis.config");

const RateLimiter = () => async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized access" });

    const userKey = `user:${user.id}`;
    if (user.accountType?.isFree) {
      const daykey = `{daily:${userKey}:${new Date()
        .toISOString()
        .slice(0, 10)}}`;
      const dailyCount = await redisClient.get(daykey);
      if (dailyCount && parseInt(dailyCount, 10) >= 50) {
        return res
          .status(429)
          .json({ message: "Daily API limit reached (50 calls)." });
      }
      await redisClient.incr(daykey);
      if (!dailyCount) {
        const now = new Date();
        const secondsUntilEndOfDay =
          24 * 60 * 60 -
          (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds());
        await redisClient.expire(dayKey, secondsUntilEndOfDay);
      }
    }
    const secondKey = `sec:${userKey}:${Math.floor(Date.now() / 1000)}`;
    const secCount = await redisClient.get(secondKey);
    if (secCount && parseInt(secCount, 10) >= 50) {
      return res
        .status(429)
        .json({ message: "Per second API limit reached (50 calls)." });
    }
    await redisClient.incr(secondKey);
    if (!secCount) {
      await redisClient.expire(secondKey, 1);
    }
    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    next();
  }
};

module.exports = RateLimiter;
