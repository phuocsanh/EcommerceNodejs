"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME_PRODUCT = "products";
const DOCUMENT_NAME_PRODUCT = "productModel";
const COLLECTION_NAME_CLOTHING = "clothings";
const DOCUMENT_NAME_CLOTHING = "clothingsModel";
const COLLECTION_NAME_ELECTRONIC = "electronics";
const DOCUMENT_NAME_ELECTRONIC = "electronicModel";
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
      trim: true,
    },
    product_description: { type: String },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopModel",
      required: true,
    },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_PRODUCT,
  }
);

var clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    size: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_CLOTHING,
  }
);
var electronicSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      trim: true,
      maxLength: 150,
    },
    model: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_ELECTRONIC,
  }
);

//Export the model
module.exports = {
  productModel: mongoose.model(DOCUMENT_NAME_PRODUCT, productSchema),
  clothingModel: mongoose.model(DOCUMENT_NAME_CLOTHING, clothingSchema),
  electronicModel: mongoose.model(DOCUMENT_NAME_ELECTRONIC, electronicSchema),
};
