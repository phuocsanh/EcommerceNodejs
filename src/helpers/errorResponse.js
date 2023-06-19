"use strict";

const { ReasonPhrases, StatusCodes } = require("./httpStatusCode");

const STATUS_CODE = {
  FORBIDEN: 403,
  CONFLICT: 409,
};
const REASEON_STATUS_CODE = {
  FORBIDEN: "Bad request error",
  CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = REASEON_STATUS_CODE.CONFLICT,
    status = STATUS_CODE.CONFLICT
  ) {
    super(message, status);
  }
}
class BadRequestError extends ErrorResponse {
  constructor(
    message = REASEON_STATUS_CODE.FORBIDEN,
    status = STATUS_CODE.FORBIDEN
  ) {
    super(message, status);
  }
}
class AuthFailureError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED
  ) {
    super(message, status);
  }
}
module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailureError,
};
