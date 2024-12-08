const { SendResponseSuccess } = require("../helpers/successRespone");
const CheckoutService = require("../services/checkoutService");
const { setRedis } = require("../services/redisService");

const CheckoutController = {
  async testRedisService(req, res, next) {
    SendResponseSuccess({
      res,
      message: "testRedisService",
      data: await setRedis(req.body),
    });
  },
  async checkoutReview(req, res, next) {
    SendResponseSuccess({
      res,
      message: "checkout review succsess",
      data: await CheckoutService.checkoutReview(req.body),
    });
  },
};
module.exports = CheckoutController;
