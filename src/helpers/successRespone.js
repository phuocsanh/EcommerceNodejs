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
  metaData = null,
}) => {
  return res.status(status).json({
    message,
    status,
    metaData,
  });
};
const SendResponseCreate = ({
  res,
  headers,
  message = REASEON_STATUS_CODE.CREATE,
  status = STATUS_CODE.CREATE,
  metaData = null,
}) => {
  return res.status(status).json({
    message,
    status,
    metaData,
  });
};

module.exports = {
  SendResponseCreate,
  SendResponseSuccess,
};
