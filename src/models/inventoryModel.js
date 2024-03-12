"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "inventories";
const DOCUMENT_NAME = "inventoryModel";
// Declare the Schema of the Mongo model
const inventorySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productModel",
    },
    inven_location: { type: String, default: "unKnow" },
    inven_stock: { type: Number, require: true },
    inven_shopId: { type: mongoose.Types.ObjectId, ref: "shopModel" },
    inven_revervations: { type: Array, default: [] },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
