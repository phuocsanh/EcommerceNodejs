"use strict";
const express = require("express");
const cartController = require("../../controllers/cartController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();

router.post("", asyncHandleError(cartController.addToCart));
router.delete("", asyncHandleError(cartController.delete));
router.post("/update", asyncHandleError(cartController.update));
router.get("", asyncHandleError(cartController.listToCart));

module.exports = router;
