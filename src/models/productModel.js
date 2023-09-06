"use strict";
const mongoose = require("mongoose");
const slugify = require("slugify"); // Erase if already required
const COLLECTION_NAME_PRODUCT = "products";
const DOCUMENT_NAME_PRODUCT = "productModel";
const COLLECTION_NAME_CLOTHING = "clothings";
const DOCUMENT_NAME_CLOTHING = "clothingsModel";
const COLLECTION_NAME_ELECTRONIC = "electronics";
const DOCUMENT_NAME_ELECTRONIC = "electronicModel";
const COLLECTION_NAME_FURNITURE = "furnitures";
const DOCUMENT_NAME_FURNITURE = "furnitureModel";
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
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (value) => Math.round(value * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    product_description: { type: String },
    product_slug: { type: String },
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
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_PRODUCT,
  }
);

productSchema.index({ product_name: "text", product_description: "text" });
//middleware runs before save() and create().....
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});
var clothingSchema = new mongoose.Schema(
  {
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopModel",
      required: true,
    },
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
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopModel",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_CLOTHING,
  }
);
var electronicSchema = new mongoose.Schema(
  {
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopModel",
      required: true,
    },
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
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopModel",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_ELECTRONIC,
  }
);

var furnitureSchema = new mongoose.Schema(
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
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopModel",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_FURNITURE,
  }
);

//Export the model
module.exports = {
  productModel: mongoose.model(DOCUMENT_NAME_PRODUCT, productSchema),
  clothingModel: mongoose.model(DOCUMENT_NAME_CLOTHING, clothingSchema),
  electronicModel: mongoose.model(DOCUMENT_NAME_ELECTRONIC, electronicSchema),
  furnitureModel: mongoose.model(DOCUMENT_NAME_FURNITURE, furnitureSchema),
};
