"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const { asyncHandleError, authentication } = require("../../helpers");
const userController = require("../../controllers/userController");
const router = express.Router();

router.use(authentication);

router.get("/getUserInfo", asyncHandleError(userController.getUserInfo));

module.exports = router;
