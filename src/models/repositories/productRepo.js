"use strict";

const {
  productModel,
  clothingSchema,
  electronicModel,
  furnitureModel,
} = require("../../models/productModel");
const { Types } = require("mongoose");
const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await productModel.findOne({ product_shop: "" });
};

const findAllDraftsForShop = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
module.exports = {
  findAllDraftsForShop,
};
