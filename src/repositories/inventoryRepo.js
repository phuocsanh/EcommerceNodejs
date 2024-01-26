const inventoryModel = require("../models/inventoryModel");
const { Types } = require("mongoose");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  const inven = await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_location: location,
    inven_stock: stock,
  });
};

module.exports = {
  insertInventory,
};
