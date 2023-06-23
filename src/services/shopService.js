"use strict";
const shopModel = require("../models/shopModel");

const shopService = {
  async findShopByEmail(
    email,
    select = {
      email: 1,
      password: 1,
      name: 1,
      roles: 1,
      status: 1,
    }
  ) {
    return await shopModel.findOne({ email: email }).select(select).lean();
  },
};

module.exports = shopService;
