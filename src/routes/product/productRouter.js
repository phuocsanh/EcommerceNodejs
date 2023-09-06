"use strict";
const express = require("express");
const productController = require("../../controllers/productController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();

router.get(
  "/product/search/:keySearch",
  asyncHandleError(productController.getlistSearchProduct)
);
router.get(
  "/product/search/:keySearch",
  asyncHandleError(productController.findAllProducts)
);

// authentication
router.use(authentication);

router.post(
  "/product/createProduct",
  asyncHandleError(productController.createProduct)
);
router.post(
  "/product/publish/:id",
  asyncHandleError(productController.publishProductByShop)
);
router.post(
  "/product/unPublish/:id",
  asyncHandleError(productController.unPublishProductByShop)
);

router.get(
  "/product/drafts/all",
  asyncHandleError(productController.getAllDraftsForShop)
);
router.get(
  "/product/publish/all",
  asyncHandleError(productController.getAllPublishForShop)
);
module.exports = router;
