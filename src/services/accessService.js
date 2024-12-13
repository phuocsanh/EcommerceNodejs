"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyTokenService");
const {
  createTokenPair,
  getDataByFields,
  getHash,
  generateSixDigitOtp,
  mongoObjectId,
  generateRandomPassword,
} = require("../utils");
const {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("../helpers/errorResponse");
const shopService = require("./userService");
const { verifyJWT } = require("../middlewares/checkAuth");
const { findUserByEmail } = require("./userService");
const sendTextEmailOtp = require("../utils/sendmail");
const { setAsyncRedis, getAsyncRedis } = require("../services/redisService");
const userVerifyModel = require("../models/userVerifyModel");
const userModel = require("../models/userModel");
const userService = require("./userService");

const roles = {
  USER: "USER",
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDIT: "EDIT",
  ADMIN: "ADMIN",
};
const accessService = {
  async handleRefreshToken({ refreshToken, user, keyStore }) {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Có sự có, Vui lòng đăng nhập lại!");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Lỗi xác thực");
    }
    const found = findUserByEmail(email);
    if (!found) throw new AuthFailureError("Người dùng chưa đăng kí");
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  },

  async logout(keyStore) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  },

  async login({ email, password, refreshToken = null }) {
    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestError("Không tìm thấy email");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AuthFailureError("Sai email hoặc mật khẩu!");
    }

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair(
      { userId: user._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
      userId: user._id,
    });
    return {
      user: getDataByFields({
        fields: ["_id", "email", "name"],
        object: user,
      }),
      tokens,
    };
  },

  async registerEmail({ email }) {
    const user = await userModel.findOne({ email }).lean();
    if (user) {
      throw new BadRequestError("Email đã được đăng ký rồi");
    }
    const hashKey = getHash(email.toLowerCase());
    const otp = generateSixDigitOtp();
    const data = await setAsyncRedis(hashKey, otp.toString(), { EX: 5 * 60 });
    if (data !== "OK") {
      throw new BadRequestError(`Gửi otp thất bại`);
    }
    //. Save otp to MongoDB
    const verify = await userVerifyModel.create({
      verifyOtp: otp.toString(),
      verifyKey: email,
      verifyKeyHash: hashKey,
    });
    if (!verify) {
      throw new BadRequestError("Gửi otp thất bại");
    }

    const res = await sendTextEmailOtp({
      to: email,
      text: `Mã OTP của bạn là ${otp}. Vui lòng nhập để xác thực tài khoản.`,
      html: `<strong>Mã OTP của bạn là ${otp}. Vui lòng nhập để xác thực tài khoản.</strong>`,
    });
    if (!res.success) {
      throw new BadRequestError("Gửi otp thất bại");
    }
    return {
      otp: otp,
    };
  },
  async verifyOTP({ verify_key, verify_code }) {
    const hashKey = getHash(verify_key.toLowerCase());

    let otpFound = await getAsyncRedis(hashKey);
    if (!otpFound) {
      throw new BadRequestError(`Không tìm thấy otp`);
    }

    if (otpFound !== verify_code) {
      throw new BadRequestError(`Otp không khớp`);
    }

    otpFound = await userVerifyModel.findOne({ verifyKeyHash: hashKey }).lean();
    if (!otpFound) {
      throw new BadRequestError(`Không tìm thấy otp`);
    }

    otpFound = await userVerifyModel.findByIdAndUpdate(
      otpFound._id,
      { isVerify: 1 },
      {
        new: true,
      }
    );
    if (!otpFound) {
      throw new BadRequestError(`Xác thực otp lỗi`);
    }
    return {
      token: otpFound.verifyKeyHash,
    };
  },
  async updatePasswordRegister({ user_token, user_password }) {
    const userVerify = await userVerifyModel
      .findOne({ verifyKeyHash: user_token })
      .lean();

    if (!userVerify) {
      throw new BadRequestError(`Không tìm thấy tài khoản`);
    }

    if (!userVerify.isVerify) {
      throw new BadRequestError(`Tài khoản chưa xác thực`);
    }

    const passwordHash = await bcrypt.hash(user_password, 10);
    const newUser = await userModel.create({
      name: `sq-${uuidv4().slice(0, 6)}`,
      email: userVerify.verifyKey,
      password: passwordHash,
      roles: roles.USER,
    });
    if (!newUser) {
      throw new BadRequestError(`Tạo mật khẩu lỗi`);
    }

    return {
      user: getDataByFields({
        fields: ["_id", "email", "name"],
        object: newUser,
      }),
    };
  },
  async forgetPassword({ email }) {
    const user = await userModel.findOne({ email: email }).lean();

    if (!user) {
      throw new BadRequestError(`Không tìm thấy tài khoản`);
    }

    const newPass = generateRandomPassword();
    const passwordHash = await bcrypt.hash(newPass, 10);
    const newUser = await userModel.findByIdAndUpdate(
      user._id,
      { password: passwordHash },
      { new: true, runValidators: true }
    );
    if (!newUser) {
      throw new BadRequestError(`Không tìm thấy tài khoản!`);
    }
    const res = await sendTextEmailOtp({
      to: email,
      newPass,
      subject: "Quên mật khẩu",
      text: `Mật khẩu của bạn là ${newPass}. Vui lòng dùng mật khẩu mới để đăng nhập.`,
      html: `<strong>Mật khẩu của bạn là  ${newPass}. Vui lòng dùng mật khẩu mới để đăng nhập.</strong>`,
    });
    if (!res.success) {
      throw new BadRequestError("Gửi mật khẩu mới thất bại!");
    }
    return {
      user: getDataByFields({
        fields: ["_id", "email", "name"],
        object: newUser,
      }),
      timmeCountDown: 60,
    };
  },
};
module.exports = accessService;
