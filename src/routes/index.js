"use strict";
const express = require("express");
const { apiKey, chekPermission } = require("../middlewares/checkAuth");
const router = express.Router();

router.use(apiKey);
router.use(chekPermission("0000"));
router.use("/v1/api", require("./product/productRouter"));
router.use("/v1/api", require("./access/accessRouter"));

module.exports = router;
