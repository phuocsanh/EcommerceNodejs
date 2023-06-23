"use strict";
const keyTokenModel = require("../models/keyTokenModel");
const { Types } = require("mongoose");
const KeyTokenService = {
  async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    try {
      const filter = { user: userId },
        update = {
          publicKey: publicKey,
          privateKey: privateKey,
          refreshTokenUsed: [],
          refreshToken,
        },
        options = {
          upsert: true,
          new: true,
        };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  },

  async findUserById(userId) {
    return await keyTokenModel.findOne({ user: Types.ObjectId(userId) }).lean();
  },
  async removeKeyById(id) {
    return await keyTokenModel.remove(id);
  },
  async findByRefreshTokenUsed(refreshToken) {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  },
  async findByRefreshToken(refreshToken) {
    return await keyTokenModel.findOne({ refreshToken });
  },
  async deleteKeyById(userId) {
    return await keyTokenModel.findByIdAndDelete({ user: userId });
  },
};
module.exports = KeyTokenService;
