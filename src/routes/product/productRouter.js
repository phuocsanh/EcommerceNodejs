"use strict";
const express = require("express");
const productController = require("../../controllers/productController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();

// authentication
router.use(authentication);
//logout
router.post(
  "/product/createProduct",
  asyncHandleError(productController.createProduct)
);

module.exports = router;
