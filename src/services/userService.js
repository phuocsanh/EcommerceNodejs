"use strict";
const { BadRequestError } = require("../helpers/errorResponse");
const userModel = require("../models/userModel");
const { getDataByFields, mongoObjectId } = require("../utils");

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
  async getUserInfo({ user_id }) {
    const user = await userModel.findById(user_id).lean();
    if (!user) {
      throw new BadRequestError("Không tìm thấy user");
    }
    return getDataByFields({
      fields: ["_id", "email", "name"],
      object: user,
    });
  },
};

module.exports = userService;
