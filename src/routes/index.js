"use strict";
const express = require("express");
const router = express.Router();
// const { pushToLogDiscord } = require("../middlewares");
// Add log to discord
// router.use(pushToLogDiscord);
router.use("/v1/api/banner", require("./banner/bannerRouter"));
router.use("/v1/api/category", require("./category/categoryRouter"));
router.use("/v1/api/comment", require("./comment/commentRouter"));
router.use("/v1/api/inventory", require("./inventory/inventoryRouter"));
router.use("/v1/api/checkout", require("./checkout/checkoutRouter"));
router.use("/v1/api/cart", require("./cart/cartRouter"));
router.use("/v1/api/discount", require("./discount/discountRouter"));
router.use("/v1/api/product", require("./product/productRouter"));
router.use("/v1/api/auth", require("./access/accessRouter"));
router.use("/v1/api/user", require("./user/userRouter"));

module.exports = router;
