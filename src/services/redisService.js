"use strict";
const redis = require("redis");
const { promisify } = require("util");
const { reservationInventory } = require("../repositories/inventoryRepo");
const redisClient = redis.createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (err) => console.log("Redis Client Error", err));

redisClient.connect();

const pexpire = promisify(redisClient.pExpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setNX).bind(redisClient);

const setRedis = async () => {
  console.log("🚀 ~ setRedis ~ setRedis:");
  await redisClient.set("key", "value");
  const value = await redisClient.get("key");
  console.log("🚀 ~ setRedis ~ value:", value);
};

// redisClient.ping((err, result) => {
//   if (err) {
//     console.log(" ~ redisClient.ping ~ err:", err);
//   } else {
//     console.log(" ~ redisClient.ping ~ result:", result);
//   }
// });

// const pexpire = promisify(redisClient.pexpire).bind(redisClient);
// const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2022_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;
  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log("🚀 ~ acquireLock ~ result:", result);
    if (result === 1) {
      // Thao tác với inventory
      const isReversation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};
const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};
module.exports = {
  acquireLock,
  releaseLock,
  setRedis,
};
