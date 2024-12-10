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
    console.log("🚀 ~ handleRefreshToken ~ keyStore:", keyStore);
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened, Please relogin!");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not register");
    }
    const found = findUserByEmail(email);
    if (!found) throw new AuthFailureError("Shop not register");
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
    console.log("🚀 ~ login ~ user:", user._id);
    if (!user) {
      throw new BadRequestError("Not found email");
    }

    const match = bcrypt.compare(password, user.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
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
      throw new BadRequestError("Email address is already");
    }
    const hashKey = getHash(email.toLowerCase());
    console.log("Hashed key:", hashKey);
    const otp = generateSixDigitOtp();
    const data = await setAsyncRedis(hashKey, otp.toString(), { EX: 5 * 60 });
    if (data !== "OK") {
      throw new BadRequestError(
        `Failed to set key ${hashKey} with expiration.`
      );
    }
    //. Save otp to MongoDB
    const verify = await userVerifyModel.create({
      verifyOtp: otp.toString(),
      verifyKey: email,
      verifyKeyHash: hashKey,
    });
    if (!verify) {
      throw new BadRequestError("Send mail failed");
    }

    const res = await sendTextEmailOtp(email, otp);
    if (!res.success) {
      throw new BadRequestError("Send mail failed");
    }
    return {
      otp: otp,
    };
  },
  async verifyOTP({ verify_key, verify_code }) {
    const hashKey = getHash(verify_key.toLowerCase());

    let otpFound = await getAsyncRedis(hashKey);
    if (!otpFound) {
      throw new BadRequestError(`Not found otp`);
    }

    if (otpFound !== verify_code) {
      throw new BadRequestError(`Otp not match`);
    }

    otpFound = await userVerifyModel.findOne({ verifyKeyHash: hashKey }).lean();
    if (!otpFound) {
      throw new BadRequestError(`Not found otp mongo`);
    }

    otpFound = await userVerifyModel.findByIdAndUpdate(
      otpFound._id,
      { isVerify: 1 },
      {
        new: true,
      }
    );
    if (!otpFound) {
      throw new BadRequestError(`Update isverify error`);
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
      throw new BadRequestError(`Not found user`);
    }

    if (!userVerify.isVerify) {
      throw new BadRequestError(`User not verify yet`);
    }

    const passwordHash = await bcrypt.hash(user_password, 10);
    const newUser = await userModel.create({
      name: `sq-${uuidv4().slice(0, 6)}`,
      email: userVerify.verifyKey,
      password: passwordHash,
      roles: roles.USER,
    });
    if (!newUser) {
      throw new BadRequestError(`CreateShop failed`);
    }

    return {
      user: getDataByFields({
        fields: ["_id", "email", "name"],
        object: newUser,
      }),
    };
  },
};
module.exports = accessService;
