"use strict";
const mongoose = require("mongoose");
const slugify = require("slugify"); // Erase if already required
const COLLECTION_NAME_PRODUCT = "products";
const DOCUMENT_NAME_PRODUCT = "productModel";
const COLLECTION_NAME_CLOTHING = "clothings";
const DOCUMENT_NAME_CLOTHING = "clothingsModel";
const COLLECTION_NAME_ELECTRONIC = "electronics";
const COLLECTION_NAME_WATCH = "watches";
const COLLECTION_NAME_WALLET_BAG = "walletbags";
const DOCUMENT_NAME_ELECTRONIC = "electronicModel";
const COLLECTION_NAME_FURNITURE = "furnitures";
const DOCUMENT_NAME_FURNITURE = "furnitureModel";
const DOCUMENT_NAME_WATCH = "watchModel";
const DOCUMENT_NAME_WALLET_BAG = "wallet_bag_Model";
// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
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
      enum: ["Electronic", "Clothing", "Furniture", "Wallet_Bag", "Watch"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shopModel",
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },
    product_discountedPrice: {
      type: Number,
      required: true,
    },
    product_selled: {
      type: Number,
      default: 0,
    },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    isDraft: { type: Boolean, default: false, index: true, select: false },
    isPublished: { type: Boolean, default: true, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_PRODUCT,
  }
);
productSchema.index({ isPublished: 1, product_type: 1 });
productSchema.index({ product_name: "text", product_description: "text" });
//middleware runs before save() and create().....
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

productSchema.pre("save", function (next) {
  if (this.discount) {
    // Giảm giá theo %
    this.product_discountedPrice =
      this.product_price - (this.product_price * this.discount) / 100;
  } else {
    this.product_discountedPrice = this.product_price; // Không có discount
  }
  next();
});

// Middleware tính giá sau giảm khi update
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  const product_price = update.product_price || this.getQuery().product_price;
  const discount = update.discount || this.getQuery().discount;
  if (discount) {
    // Giảm giá theo %
    update.product_discountedPrice =
      product_price - (product_price * discount) / 100;

    // Giảm giá cố định
  } else {
    update.product_discountedPrice = this.product_price; // Không giảm giá
  }

  next();
});

const clothingSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_CLOTHING,
  }
);
const electronicSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_ELECTRONIC,
  }
);

const furnitureSchema = new mongoose.Schema(
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

const watchSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_WATCH,
  }
);
const wallet_bagSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME_WALLET_BAG,
  }
);
//Export the model
module.exports = {
  productModel: mongoose.model(DOCUMENT_NAME_PRODUCT, productSchema),
  clothingModel: mongoose.model(DOCUMENT_NAME_CLOTHING, clothingSchema),
  electronicModel: mongoose.model(DOCUMENT_NAME_ELECTRONIC, electronicSchema),
  furnitureModel: mongoose.model(DOCUMENT_NAME_FURNITURE, furnitureSchema),
  watchModel: mongoose.model(DOCUMENT_NAME_WATCH, watchSchema),
  walletBagModel: mongoose.model(DOCUMENT_NAME_WALLET_BAG, wallet_bagSchema),
};
