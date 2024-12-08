"use strict";
const userModel = require("../models/userModel");

const userService = {
  async findUserByEmail(
    email,
    select = {
      email: 1,
      password: 1,
      name: 1,
      roles: 1,
      status: 1,
    }
  ) {
    return await userModel.findOne({ email: email }).select(select).lean();
  },
};

module.exports = userService;
