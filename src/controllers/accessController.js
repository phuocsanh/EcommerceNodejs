"use strict";
const {
  SendResponseCreate,
  SendResponseSuccess,
} = require("../helpers/successRespone");
const accessService = require("../services/accessService");
const accessController = {
  async handleRefreshToken(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get token success",
      metadata: await accessService.handleRefreshToken(res.body.refreshToken),
    });
  },
  async logout(req, res, next) {
    await accessService.logout(req.keyStore);
    SendResponseSuccess({
      res,
      message: "Logout successfully",
    });
  },
  async login(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Login successfully",
      metaData: await accessService.login(req.body),
    });
  },
  async signUp(req, res, next) {
    SendResponseCreate({
      res,
      message: "Register successfully",
      metaData: await accessService.signUp(req.body),
    });
  },
};

module.exports = accessController;
