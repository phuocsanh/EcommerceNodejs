const mongoose = require("mongoose");
const COLLECTION_NAME = "categories";
const DOCUMENT_NAME = "categoryModel";

const categorySchema = new mongoose.Schema(
  {
    category_title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    category_name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    category_pictrure: {
      type: String,
      required: true,
      trim: true,
    },

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: true, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = {
  categoryModel: mongoose.model(DOCUMENT_NAME, categorySchema),
};
