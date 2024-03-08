"use strict";
const Logger = require("../loggers/discordLogV2");
const pushToLogDiscord = async (req, res, next) => {
  try {
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
    return next();
  } catch (error) {
    next(error);
  }
};
module.exports = {
  pushToLogDiscord,
};
