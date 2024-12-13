"use strict";
const JWT = require("jsonwebtoken");
const lodash = require("lodash");
const { Types } = require("mongoose");
const crypto = require("crypto");

const mongoObjectId = (id) => {
  return new Types.ObjectId(id);
};

function getHash(key) {
  const hash = crypto.createHash("sha256");
  hash.update(key);
  return hash.digest("hex");
}

// Hàm tạo key Redis
function getUserKey(hashKey) {
  return `u:${hashKey}:otp`;
}

function generateRandomPassword(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }

  return password;
}

const generateSixDigitOtp = () => {
  return crypto.randomInt(100000, 1000000); // Tạo số ngẫu nhiên từ 100000 đến 999999
};

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
// ['a','b'] convert to {a:1, b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((e) => [e, 1]));
};
const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((e) => [e, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null || obj[k] == undefined) {
      delete obj[k];
    }
    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      removeUndefinedObject(obj[k]);
    }
  });

  return obj;
};

const updateNestedObjectParser = (objParams) => {
  const obj = removeUndefinedObject(objParams);
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] == "object" && !Array.isArray(obj[k])) {
      const res = updateNestedObjectParser(obj[k]);
      Object.keys(res).forEach((a) => {
        final[`${k}.${a}`] = res[a];
      });
    } else {
      final[k] = obj[k];
    }
  });

  return final;
};

module.exports = {
  getUserKey,
  getHash,
  generateSixDigitOtp,
  createTokenPair,
  getDataByFields,
  mongoObjectId,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectParser,
  generateRandomPassword,
};
