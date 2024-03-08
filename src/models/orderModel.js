"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "orders";
const DOCUMENT_NAME = "orderModel";
// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema(
  {
    order_userId: { type: Number, require: true },
    /* 
		{	
			order_checkout:{
				totalPrice,
				totalApplyDiscount, 
				feeShip,
			}
		}
	 */
    order_checkout: { type: Object, default: {} },
    /*
		{
			street, 
			city,
			state,
			country,
			
		}
	*/
    order_shipping: { type: Object, default: {} },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: { type: Array, require: true },
    order_trackingNumber: { type: String, default: "#0000108032024" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "canceled", "delivered"],
      default: "penđing",
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
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
