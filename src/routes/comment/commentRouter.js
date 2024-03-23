"use strict";
const express = require("express");
const commentController = require("../../controllers/commentController");
const { asyncHandleError, authentication } = require("../../helpers");

const router = express.Router();
router.use(authentication);
router.post("", asyncHandleError(commentController.createComment));
router.get("", asyncHandleError(commentController.getCommentsParentId));

module.exports = router;
