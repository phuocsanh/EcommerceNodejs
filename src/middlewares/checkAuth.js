"use strict";

const apiKeyModel = require("../models/apiKeyModel");
const { findApiKeyById } = require("../services/apiKeyService");
const crypto = require("node:crypto");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const newKey = await apiKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"),
      permissions: ["0000"],
    });

    // const key = req.headers[HEADER.API_KEY]?.toString();
    // if (!key) {
    //   return res.status(403).json({ message: "Forbidden key" });
    // }
    // const objKey = await findApiKeyById(key);
    // if (!objKey) {
    //   return res.status(403).json({ message: "Forbidden key obj" });
    // }
    // req.objKey = objKey;
    // return next();
  } catch (error) {
    // return res.status(400).json({ message: error.message });
  }
};

const chekPermission = (permission) => {
  return async (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: "Permisson denied" });
    }
    console.log(
      // "~ file: checkAuth.js:40 ~ return ~ req.objKey.permissions:",
      req.objKey.permissions
    );
    const validPermissions = req.objKey.permissions.includes(permission);
    if (!validPermissions) {
      return res.status(403).json({ message: "Permission denied" });
    }
    return next();
  };
};

module.exports = { apiKey, chekPermission, HEADER };
