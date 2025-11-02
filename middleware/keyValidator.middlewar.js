const key = require("../model/key.model");
const redisClient = require("../config/redis.config");

const KeyValidator = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res
        .status(401)
        .json({ Message: "unauthroized user access, user not found" });
    }
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
      return res
        .status(401)
        .json({ Message: "api key not found, unauthorized api access" });
    }
    const keyRegex = /^BCP-[a-f0-9]{20}-(isFree|isPaid)$/;
    if (!keyRegex.test(apiKey)) {
      return res
        .status(401)
        .json({ Message: "api key does not match the correct format" });
    }
    const rediskey = `apiKey:${apiKey}`;
    let keyRecord;
    const cachedKey = await redisClient.get(rediskey);
    if (cachedKey) {
      keyRecord = JSON.parse(cachedKey);
    } else {
      keyRecord = await key.findOne({ Value: apiKey }).lean();
      if (!keyRecord) {
        return res.status(401).json({
          Message:
            "This key does not exists or you have not provided the right key",
        });
      }
      await redisClient.set(rediskey, JSON.stringify(keyRecord), { EX: 86400 });
    }
    if (keyRecord.UserId.toString() !== user.id.toString()) {
      return res
        .status(401)
        .json({ Message: "This api key does not belong to you" });
    }
    req.apiKeyData = {
      key: apiKey,
      userId: keyRecord.UserId,
    };

    next();
  } catch (err) {
    res.status(500).json({
      message: err.message || "Internal server error during key validation.",
    });
  }
};

module.exports = KeyValidator;
