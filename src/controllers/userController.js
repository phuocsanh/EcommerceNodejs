"use strict";
const { SendResponseSuccess } = require("../helpers/successRespone");
const userService = require("../services/userService");
const userController = {
  async getUserInfo(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get user info success",
      data: await userService.getUserInfo({
        user_id: req.user.userId,
      }),
    });
  },
};

module.exports = userController;
