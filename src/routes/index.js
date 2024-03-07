"use strict";
const express = require("express");
const { apiKey, chekPermission } = require("../middlewares/checkAuth");
const router = express.Router();

router.use(apiKey);
router.use(chekPermission("0000"));
router.use("/v1/api/checkout", require("./checkout/checkoutRouter"));
router.use("/v1/api/cart", require("./cart/cartRouter"));
router.use("/v1/api/discount", require("./discount/discountRouter"));
router.use("/v1/api/product", require("./product/productRouter"));
router.use("/v1/api/shop", require("./access/accessRouter"));

module.exports = router;
