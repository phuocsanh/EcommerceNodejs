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
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid userId");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  // Verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request");
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid userId");
    req.keyStore = keyStore;
    req.user = decodeUser;
    console.log(" ~ authentication ~ decodeUser:", decodeUser);
    return next();
  } catch (error) {
    throw error;
  }
});
module.exports = {
  countConnect,
  checkOverload,
  asyncHandleError,
  authentication,
};
