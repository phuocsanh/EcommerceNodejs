"use strict";
const express = require("express");
const accessController = require("../../controllers/accessController");
const { asyncHandleError, authentication } = require("../../helpers");
const router = express.Router();
// signup
router.post(
  "/register-email",
  asyncHandleError(accessController.registerEmail)
);
router.post(
  "/update_pass_register",
  asyncHandleError(accessController.updatePasswordRegister)
);
router.post("/verify-otp", asyncHandleError(accessController.verifyOTP));
//login
router.post("/login", asyncHandleError(accessController.login));
// authentication
router.use(authentication);
//logout
router.post("/logout", asyncHandleError(accessController.logout));
router.post(
  "/handle-refresh-token",
  asyncHandleError(accessController.handleRefreshToken)
);

module.exports = router;
