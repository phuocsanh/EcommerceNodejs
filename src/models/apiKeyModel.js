"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "api-keys";
const DOCUMENT_NAME = "apiKeyModel";
// Declare the Schema of the Mongo model
var apiKeyTokenSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      default: [],

      enum: ["0000", "11111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apiKeyTokenSchema);
