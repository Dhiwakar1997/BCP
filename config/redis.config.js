const redis = require("redis");
const redisClient = redis.createClient();

redisClient.on("error", (err) => console.log(err.message));

let isConncted = false;
async function ConnectRedis() {
  if (!isConncted) {
    await redisClient.connect();
    isConncted = true;
  }
}

ConnectRedis().catch((err) => {
  console.log("failed to connect with the redis middleware");
});

module.exports = redisClient;
