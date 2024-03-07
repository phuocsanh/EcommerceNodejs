const { SendResponseSuccess } = require("../helpers/successRespone");
const CheckoutService = require("../services/checkoutService");

const CheckoutController = {
  async checkoutReview(req, res, next) {
    SendResponseSuccess({
      res,
      message: "checkout review succsess",
      metadata: await CheckoutService.checkoutReview(req.body),
    });
  },
};
module.exports = CheckoutController;
