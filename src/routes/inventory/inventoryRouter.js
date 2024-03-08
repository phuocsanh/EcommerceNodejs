"use strict";
const express = require("express");
const inventoryController = require("../../controllers/inventoryController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();
router.use(authentication);

router.post("", asyncHandleError(inventoryController.addStockInventory));

module.exports = router;
