"use strict";
const { BadRequestError } = require("../../src/helpers/errorResponse");
const inventoryModel = require("../models/inventoryModel");
const { getProductById } = require("../repositories/productRepo");
class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "location null",
  }) {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("Product not found");
    const query = {
        inven_shopId: shopId,
        inven_prodcutId: productId,
      },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
        $set: {
          inven_location: location,
        },
      },
      option = { upsert: true, new: true };
    return await inventoryModel.findOneAndUpdate(query, updateSet, option);
  }
}
module.exports = InventoryService;
