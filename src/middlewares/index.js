"use strict";
const Logger = require("../loggers/discordLogV2");
const pushToLogDiscord = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === "production") {
      // Đoạn code cho môi trường production
      console.log("Ứng dụng đang chạy ở môi trường production");
      Logger.sendFormatCode({
        title: `Method: ${req.method}`,
        code:
          req.method === "GET"
            ? req.query
            : req.body?.password
            ? { ...req.body, password: "*****" }
            : req.body,
        message: `${req.get("host")}${req.originalUrl}`,
      });
    } else {
      // Đoạn code cho môi trường development
      console.log("Ứng dụng đang chạy ở môi trường development");
    }

    return next();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  pushToLogDiscord,
};
