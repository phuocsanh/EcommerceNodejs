"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "key-tokens";
const DOCUMENT_NAME = "keyTokenModel";
// Declare the Schema of the Mongo model
var keyToken = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "shopModel",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      // để check Token bị sử dụng lại
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keyToken);
