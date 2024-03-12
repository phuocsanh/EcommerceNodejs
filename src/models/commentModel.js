"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "comments";
const DOCUMENT_NAME = "commentModel";
// Declare the Schema of the Mongo model
const commentSchema = new mongoose.Schema(
  {
    commemt_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "productModel",
    },
    comment_userId: {
      type: Number,
      default: 1,
    },
    comment_content: {
      type: String,
      default: "",
    },
    comment_left: { type: Number, default: 0 },
    comment_right: { type: Number, default: 0 },
    comment_parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, commentSchema);
