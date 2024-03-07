"use strict";
const { resolve } = require("path");
const redis = require("redis");
const { promisfy } = require("util");
const redisClient = redis.createClient();

const pexpire = promisfy(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisfy(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2022_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000;
  for (let i = 0; i < retryTimes; i++) {
    const result = await setnxAsync(key, expireTime);
    console.log("🚀 ~ acquireLock ~ result:", result);
    if (result === 1) {
      // Thao tác với inventory
      return key;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
};
const releaseLock = async (keyLock) => {
  const delAsyncKey = promisfy(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};
module.exports = {
  acquireLock,
  releaseLock,
};
