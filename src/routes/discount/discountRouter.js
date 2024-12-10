"use strict";
const express = require("express");
const discountController = require("../../controllers/discountController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();

router.post(
  "/amount",
  asyncHandleError(discountController.getAllDiscountAmount)
);
router.get(
  "/listProductCode",
  asyncHandleError(discountController.getAllDiscountCodesWithProduct)
);
// authentication
router.use(authentication);
router.post("", asyncHandleError(discountController.createDiscountCode));
router.get("", asyncHandleError(discountController.getAllDiscountCodes));

module.exports = router;
