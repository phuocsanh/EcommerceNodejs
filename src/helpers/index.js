const { countConnect, checkOverload } = require("./checkConnect");

const asyncHandleError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports = {
  countConnect,
  checkOverload,
  asyncHandleError,
};
