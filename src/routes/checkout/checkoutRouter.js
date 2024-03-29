"use strict";
const express = require("express");
const checkoutController = require("../../controllers/checkoutController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();

router.post("/review", asyncHandleError(checkoutController.checkoutReview));
router.get("", asyncHandleError(checkoutController.testRedisService));

module.exports = router;
