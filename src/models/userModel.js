"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "users";
const DOCUMENT_NAME = "userModel";
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
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
      default: "active",
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
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
