const { SendResponseSuccess } = require("../helpers/successRespone");
const DiscountService = require("../services/discountService");
const discountService = require("../services/discountService");

const DiscountController = {
  async createDiscountCode(req, res, next) {
    SendResponseSuccess({
      res,
      message: "create discount code succsess",
      data: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    });
  },
  async getAllDiscountCodes(req, res, next) {
    SendResponseSuccess({
      res,
      message: "succsess",
      data: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        shopId: req.user.userId,
      }),
    });
  },
  async getAllDiscountAmount(req, res, next) {
    SendResponseSuccess({
      res,
      message: "succsess",
      data: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    });
  },
  async getAllDiscountCodesWithProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "succsess",
      data: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    });
  },
};
module.exports = DiscountController;
