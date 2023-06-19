"use strict";
const express = require("express");
const { apiKey, chekPermission } = require("../middlewares/checkAuth");
const router = express.Router();
// router.get("/", function (req, res, next) {
//   const string = "Hello World ";
//   return res.status(200).json({ data: string.repeat(10) });
// });
router.use(apiKey);
router.use(chekPermission("0000"));
router.use("/v1/api", require("./access/accessRouter"));
module.exports = router;
