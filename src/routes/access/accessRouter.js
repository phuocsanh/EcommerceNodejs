"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();

// signup
router.post("/shop/signup", asyncHandleError(accessController.signUp));
//login
router.post("/shop/login", asyncHandleError(accessController.login));
// authentication
router.use(authentication);
//logout
router.post("/shop/logout", asyncHandleError(accessController.logout));
module.exports = router;
