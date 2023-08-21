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
router.get(
  "/product/drafts/all",
  asyncHandleError(productController.getAllDraftsForShop)
);
module.exports = router;
