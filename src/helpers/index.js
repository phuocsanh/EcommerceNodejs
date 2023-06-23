const { HEADER } = require("../middlewares/checkAuth");
const { findUserById } = require("../services/keyTokenService");
const { countConnect, checkOverload } = require("./checkConnect");
const { AuthFailureError, NotFoundError } = require("./errorResponse");
const JWT = require("jsonwebtoken");

const asyncHandleError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
const authentication = asyncHandleError(async (req, res, next) => {
  // check userId missing?
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid request");
  // get access token
  const keyStore = await findUserById(userId);
  // console.log(" ~ file: index.js:18 ~ authentication ~ keyStore:", keyStore);

  if (!keyStore) throw new NotFoundError("Not found keyStore");
  // Verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  console.log(
    "🚀 ~ file: index.js:23 ~ authentication ~ accessToken:",
    accessToken
  );
  if (!accessToken) throw new AuthFailureError("Invalid request");

  try {
    console.log(" ~ file: index.js:26 ~ authentication ~ try:");
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    console.log(
      " ~ file: index.js:27 ~ authentication ~ decodeUser:",
      decodeUser
    );
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    console.log("file: index.js:30 ~ authentication ~ error:", error);
    throw error;
  }
});
module.exports = {
  countConnect,
  checkOverload,
  asyncHandleError,
  authentication,
};
