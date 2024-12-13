"use strict";
const express = require("express");
const { asyncHandleError, authentication } = require("../../helpers");
const BannerController = require("../../controllers/bannerController");

const router = express.Router();

router.get("", asyncHandleError(BannerController.getBanner));

module.exports = router;
