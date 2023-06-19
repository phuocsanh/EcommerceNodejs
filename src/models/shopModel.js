"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "shops";
const DOCUMENT_NAME = "shopModel";
// Declare the Schema of the Mongo model
var shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: true,
      trim: true,
      maxLength: 150,
    },
    email: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      // required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: {
      type: mongoose.Schema.Types.Boolean,
      // required: true,
    },
    roles: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, shopSchema);
