"use strict";
const express = require("express");
const productController = require("../../controllers/productController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandleError(productController.getlistSearchProduct)
);
router.get("", asyncHandleError(productController.findAllProducts));
router.get("/:product_id", asyncHandleError(productController.findProduct));
// authentication
router.use(authentication);
router.patch("/:productId", asyncHandleError(productController.updateProduct));
router.post(
  "/createProduct",
  asyncHandleError(productController.createProduct)
);
router.post(
  "/publish/:id",
  asyncHandleError(productController.publishProductByShop)
);
router.post(
  "/unPublish/:id",
  asyncHandleError(productController.unPublishProductByShop)
);

router.get(
  "/drafts/all",
  asyncHandleError(productController.getAllDraftsForShop)
);
router.get(
  "/publish/all",
  asyncHandleError(productController.getAllPublishForShop)
);
module.exports = router;
