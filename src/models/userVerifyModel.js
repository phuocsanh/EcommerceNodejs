"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "user-verifies";
const DOCUMENT_NAME = "userVerifyModel";
// Declare the Schema of the Mongo model
const userVerifySchema = new mongoose.Schema(
  {
    verifyOtp: { type: String, required: true },
    verifyKey: { type: String, required: true },
    verifyKeyHash: { type: String, required: true },
    isVerify: { type: Number, default: 0 },
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
module.exports = mongoose.model(DOCUMENT_NAME, userVerifySchema);
