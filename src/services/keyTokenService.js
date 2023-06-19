"use strict";
const keyTokenModel = require("../models/keyTokenModel");

const KeyTokenService = {
  async createKeyToken({ userId, publicKey, privateKey, refreshToken }) {
    console.log(
      " ~ file: keyTokenService.js:6 ~ createKeyToken ~ refreshToken:",
      refreshToken
    );
    console.log(
      " ~ file: keyTokenService.js:6 ~ createKeyToken ~ privateKey:",
      privateKey
    );
    console.log(
      " ~ file: keyTokenService.js:6 ~ createKeyToken ~ publicKey:",
      publicKey
    );
    console.log(
      "~ file: keyTokenService.js:6 ~ createKeyToken ~ userId:",
      userId
    );
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
      console.log(
        "~ file: keyTokenService.js:23 ~ createKeyToken ~ tokens:",
        tokens
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  },
};
module.exports = KeyTokenService;
