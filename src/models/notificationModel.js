"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "notifications";
const DOCUMENT_NAME = "notificationtModel";
// Declare the Schema of the Mongo model

// order-001: order successfully
// order-002: order failed
// promotion-001: new promotion
// shop-001: new product by user following

const notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      required: true,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
    },
    noti_senderId: {
      type: Number,
      required: true,
    },
    noti_receiveId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, notificationSchema);
