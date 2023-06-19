"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const accessService = require("../../services/accessService");
const { asyncHandleError } = require("../../helpers");

const router = express.Router();

// signup
router.post("/shop/signup", asyncHandleError(accessController.signUp));
router.post("/shop/login", asyncHandleError(accessController.login));
module.exports = router;
