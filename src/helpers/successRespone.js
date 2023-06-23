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
  status = STATUS_CODE.OK,
  metadata = null,
}) => {
  return res.status(status).json({
    message,
    status,
    metadata,
  });
};
const SendResponseCreate = ({
  res,
  headers,
  message = REASEON_STATUS_CODE.CREATE,
  status = STATUS_CODE.CREATE,
  metadata = null,
}) => {
  return res.status(status).json({
    message,
    status,
    metadata,
  });
};

module.exports = {
  SendResponseCreate,
  SendResponseSuccess,
};
