"use strict";

const apiKeyModel = require("../models/apiKeyModel");

const findApiKeyById = async (keyId) => {
  const objKey = await apiKeyModel.findOne({ key: keyId, status: true }).lean();
  return objKey;
};
module.exports = { findApiKeyById };
