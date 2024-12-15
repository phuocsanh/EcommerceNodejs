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
      message: "Lấy token thành công",
      data: await accessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    });
  },

  async changePassword(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Đổi mật khẩu thành công",
      data: await accessService.changePassword({
        userId: req.user.userId,
        password: req.body.password,
        password_old: req.body.password_old,
      }),
    });
  },
  async forgetPassword(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Quên mật khẩu thành công",
      data: await accessService.forgetPassword(req.body),
    });
  },
  async logout(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Đăng xuất thành công",
      data: await accessService.logout(req.keyStore),
    });
  },
  async login(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Đăng nhập thành công",
      data: await accessService.login(req.body),
    });
  },
  async registerEmail(req, res, next) {
    SendResponseCreate({
      res,
      message: "Đăng ký thành công",
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
      message: "Tạo mật khẩu thành công",
      data: await accessService.updatePasswordRegister(req.body),
    });
  },
};

module.exports = accessController;
