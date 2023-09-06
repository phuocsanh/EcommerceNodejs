"use strict";
const JWT = require("jsonwebtoken");
const lodash = require("lodash");
const mongoose = require("mongoose");

class MongoObjectId {
  static new(userId) {
    return new mongoose.Types.ObjectId(userId);
  }
}

const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    //

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(`error verify::`, err);
      } else {
        console.log(`decode verify::`, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("~ file: index.js:34 ~ createTokenPair ~ error:", error);
    return error;
  }
};

const getDataByFields = ({ fields = [], object = {} }) => {
  return lodash.pick(object, fields);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((e) => [e, 1]));
};

module.exports = {
  createTokenPair,
  getDataByFields,
  MongoObjectId,
  getSelectData,
};
