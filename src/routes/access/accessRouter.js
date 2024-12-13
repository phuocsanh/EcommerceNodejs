"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const { asyncHandleError, authentication } = require("../../helpers");
const router = express.Router();
// signup
router.post(
  "/forgetPassword",
  asyncHandleError(accessController.forgetPassword)
);
router.post("/registerEmail", asyncHandleError(accessController.registerEmail));
router.post(
  "/updatePassRegister",
  asyncHandleError(accessController.updatePasswordRegister)
);
router.post("/verifyOtp", asyncHandleError(accessController.verifyOTP));
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
