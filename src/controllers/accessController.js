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
      metadata: await accessService.handleRefreshToken(req.body),
    });
  },
  async logout(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Logout successfully",
      metadata: await accessService.logout(req.keyStore),
    });
  },
  async login(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Login successfully",
      metadata: await accessService.login(req.body),
    });
  },
  async signUp(req, res, next) {
    SendResponseCreate({
      res,
      message: "Register successfully",
      metadata: await accessService.signUp(req.body),
    });
  },
};

module.exports = accessController;
