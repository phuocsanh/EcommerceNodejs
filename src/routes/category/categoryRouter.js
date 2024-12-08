"use strict";
const express = require("express");
const { asyncHandleError, authentication } = require("../../helpers");
const CategoryController = require("../../controllers/categoriesController");

const router = express.Router();

router.get(
  "/get-all-categories",
  asyncHandleError(CategoryController.getAllCategories)
);

module.exports = router;
