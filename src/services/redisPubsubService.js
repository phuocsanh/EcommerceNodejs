const { getRedis } = require("../dbs/initRedis");
const { instanceConnect: redisClient } = getRedis();
class RedisPubSubService {
  publish(channel, message) {
    return new Promise((resovel, reject) => {
      redisClient.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resovel(reply);
        }
      });
    });
  }
  subscribe(channel, callback) {
    redisClient.subscribe(channel);

    redisClient.on("message", (subscriberChannel, massage) => {
      callback(channel, massage);
    });
    this.unsubscribe(channel);
  }
  unsubscribe(channel) {
    redisClient.unsubscribe(channel);
  }
}
module.exports = new RedisPubSubService();
