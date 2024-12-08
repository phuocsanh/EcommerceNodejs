"use strict";
const STATUS_CODE = {
  OK: 200,
  CREATE: 200,
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
  data = null,
}) => {
  return res.status(code).json({
    message,
    code,
    data,
  });
};
const SendResponseCreate = ({
  res,
  headers,
  message = REASEON_STATUS_CODE.CREATE,
  code = STATUS_CODE.CREATE,
  data = null,
}) => {
  return res.status(code).json({
    message,
    code,
    data,
  });
};

module.exports = {
  SendResponseCreate,
  SendResponseSuccess,
};
