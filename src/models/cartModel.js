"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "carts";
const DOCUMENT_NAME = "cartModel";
// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      require: true,
      enum: ["active, completed,failed,pending"],
      default: "active",
    },
    cart_products: {
      type: Array,
      require: true,
      default: [],
    },
    /* [
		 {
			productId,
			shopId,
			quantity,
			name, 
			price
		 }
		]
	*/
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_userId: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
