"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "banners";
const DOCUMENT_NAME = "bannerModel";
// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    banner: {
      type: String,
      require: true,
    },
    type_page: {
      type: String,
      require: true,
    },

    type_app: {
      type: String,
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
