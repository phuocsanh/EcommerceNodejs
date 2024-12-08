"use strict";
const {
  SendResponseCreate,
  SendResponseSuccess,
} = require("../helpers/successRespone");
const accessService = require("../services/accessService");
const accessController = {
  async handleRefreshToken(req, res, next) {
    console.log("🚀 ~ handleRefreshToken ~ req.user:", req.keyStore);

    SendResponseSuccess({
      res,
      message: "Get token success",
      data: await accessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    });
  },
  async logout(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Logout successfully",
      data: await accessService.logout(req.keyStore),
    });
  },
  async login(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Login successfully",
      data: await accessService.login(req.body),
    });
  },
  async registerEmail(req, res, next) {
    SendResponseCreate({
      res,
      message: "Register successfully",
      data: await accessService.registerEmail(req.body),
    });
  },
  async verifyOTP(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Verify otp successfully",
      data: await accessService.verifyOTP(req.body),
    });
  },
  async updatePasswordRegister(req, res, next) {
    SendResponseCreate({
      res,
      message: "Create shop successfully",
      data: await accessService.updatePasswordRegister(req.body),
    });
  },
};

module.exports = accessController;
