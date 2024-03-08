const inventoryModel = require("../models/inventoryModel");
const { mongoObjectId } = require("../utils");

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
const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
      inven_productId: mongoObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    },
    options = { upsert: true, new: true };
  return await inventoryModel.updateOne(query, updateSet, options);
};
module.exports = {
  insertInventory,
  reservationInventory,
};
