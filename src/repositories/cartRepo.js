"use strict";
const cartModel = require("../models/cartModel");
const { mongoObjectId } = require("../utils");
const findCartById = async (cartId) => {
  return await cartModel
    .findOne({ _id: mongoObjectId(cartId), cart_state: "active" })
    .lean();
};
module.exports = {
  findCartById,
};
