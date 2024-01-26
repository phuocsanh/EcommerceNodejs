"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const { asyncHandleError, authentication } = require("../../helpers");
const router = express.Router();
// signup
router.post("/signup", asyncHandleError(accessController.signUp));
//login
router.post("/login", asyncHandleError(accessController.login));
// authentication
router.use(authentication);
//logout
router.post("/logout", asyncHandleError(accessController.logout));
router.post(
  "/handleRefreshToken",
  asyncHandleError(accessController.handleRefreshToken)
);

module.exports = router;
