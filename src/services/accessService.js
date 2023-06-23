"use strict";

const shopModel = require("../models/shopModel");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyTokenService");
const { createTokenPair, getDataByFields } = require("../utils");
const { SendErrorResponse } = require("../helpers");
const {
  BadRequestError,
  ForbiddenError,
  AuthFailureError,
} = require("../helpers/errorResponse");
const shopService = require("./shopService");
const { verifyJWT } = require("../middlewares/checkAuth");
const { findShopByEmail } = require("./shopService");

const rolesShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDIT: "EDIT",
  ADMIN: "ADMIN",
};
const accessService = {
  async handleRefreshToken({ refreshToken }) {
    console.log(
      " ~ file: accessService.js:26 ~ handleRefreshToken ~ refreshToken:",
      refreshToken
    );
    // Check token used
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      const { userId, email } = await verifyJWT(
        refreshToken,
        foundToken.privateKey
      );

      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happened, Please relogin!");
    }
    //Nếu không có refresh token used
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    console.log(
      "~ file: accessService.js:45 ~ handleRefreshToken ~ holderToken:",
      holderToken
    );
    if (!holderToken) throw new AuthFailureError("Shop not register1");

    // Verify Token
    const { userId, email } = await verifyJWT(
      refreshToken,
      holderToken.privateKey
    );
    // Check userId
    const foundShop = findShopByEmail(email);
    if (!foundShop) throw new AuthFailureError("Shop not register2");
    const tokens = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey
    );
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user: { userId, email },
      tokens,
    };
  },
  async logout(keyStore) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  },

  async login({ email, password, refreshToken = null }) {
    const shop = await shopService.findShopByEmail(email);
    if (!shop) {
      throw new BadRequestError("Not found email");
    }

    const match = bcrypt.compare(password, shop.password);
    if (!match) {
      throw new AuthFailureError("Authentication error");
    }

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair(
      { userId: shop._id, email },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      publicKey,
      privateKey,
      userId: shop._id,
    });
    return {
      shop: getDataByFields({
        fields: ["_id", "email", "name"],
        object: shop,
      }),
      tokens,
    };
  },

  async signUp({ name, email, password }) {
    const shop = await shopModel.findOne({ email }).lean();
    if (shop) {
      throw new BadRequestError("Email address is already");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: rolesShop.SHOP,
    });

    if (newShop) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      const keyToken = await KeyTokenService.createKeyToken({
        refreshToken: tokens.refreshToken,
        publicKey,
        privateKey,
        userId: newShop._id,
      });

      if (!keyToken) {
        throw new BadRequestError("Keytoken error");
      }
      return {
        shop: getDataByFields({
          fields: ["_id", "email", "name"],
          object: newShop,
        }),
        tokens,
      };
    }
  },
};
module.exports = accessService;
