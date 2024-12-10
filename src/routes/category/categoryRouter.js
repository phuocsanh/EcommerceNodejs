"use strict";
const express = require("express");
const { asyncHandleError, authentication } = require("../../helpers");
const CategoryController = require("../../controllers/categoriesController");

const router = express.Router();

router.get(
  "/getAllCategories",
  asyncHandleError(CategoryController.getAllCategories)
);

module.exports = router;
