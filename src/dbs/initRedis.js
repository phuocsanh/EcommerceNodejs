const redis = require("redis");
let client = {},
  statusConnectClient = {
    CONNECT: "connect",
    END: "end",
    RECONNECT: "reconnecting",
    ERROR: "error",
  },
  connecttionTimeout;
const REDIS_CONNECT_TIMEOUT = 10000,
  REDIS_CONNENCT_MASSAGE = {
    code: -90,
    message: {
      vn: "Redis lỗi",
      en: "Service connect error",
    },
  };
const handleErrorTimeout = () => {
  connecttionTimeout = setTimeout(() => {
    throw new RedisErrorResponse({
      message: REDIS_CONNENCT_MASSAGE.message.vn,
      statusCode: REDIS_CONNENCT_MASSAGE.code,
    });
  }, REDIS_CONNECT_TIMEOUT);
};
const handleEventConnection = ({ connectionRedis }) => {
  // Check if connect is null
  connectionRedis.on(statusConnectClient.CONNECT, () => {
    console.log("Conncetion Redis status: CONNECTED");
    clearTimeout(connecttionTimeout);
  });
  connectionRedis.on(statusConnectClient.END, () => {
    console.log("Conncetion Redis status: DISCONNECTED");
    handleErrorTimeout(connectionRedis);
  });
  connectionRedis.on(statusConnectClient.RECONNECT, () => {
    console.log("Conncetion Redis status: RECONNECTING");
    clearTimeout(connecttionTimeout);
  });
  connectionRedis.on(statusConnectClient.ERROR, () => {
    console.log("Conncetion Redis status: ERROR");
    handleErrorTimeout(connectionRedis);
  });
};
const initRedis = () => {
  const instanceRedis = redis.createClient({ url: process.env.REDIS_URL });
  instanceRedis.connect();
  client.instanceConnect = instanceRedis;
  handleEventConnection({ connectionRedis: instanceRedis });
};
const getRedis = () => client;
const closeRedis = () => {};

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
