"use strict";
const STATUS_CODE = {
  OK: 200,
  CREATE: 201,
};
const REASEON_STATUS_CODE = {
  OK: "Success",
  CREATE: "Create success",
};
const SendResponseSuccess = ({
  res,
  headers,
  message = REASEON_STATUS_CODE.OK,
  code = STATUS_CODE.OK,
  metadata = null,
}) => {
  return res.status(code).json({
    message,
    code,
    metadata,
  });
};
const SendResponseCreate = ({
  res,
  headers,
  message = REASEON_STATUS_CODE.CREATE,
  code = STATUS_CODE.CREATE,
  metadata = null,
}) => {
  return res.status(code).json({
    message,
    code,
    metadata,
  });
};

module.exports = {
  SendResponseCreate,
  SendResponseSuccess,
};
