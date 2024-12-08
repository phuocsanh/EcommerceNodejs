const { SendResponseSuccess } = require("../helpers/successRespone");
const CartService = require("../services/cartService");

const CartController = {
  async addToCart(req, res, next) {
    SendResponseSuccess({
      res,
      message: "create new cart succsess",
      data: await CartService.addToCart(req.body),
    });
  },
  async update(req, res, next) {
    SendResponseSuccess({
      res,
      message: "updated cart succsess",
      data: await CartService.addToCartV2(req.body),
    });
  },
  async delete(req, res, next) {
    SendResponseSuccess({
      res,
      message: "deleted cart succsess",
      data: await CartService.deleteUserCart(req.body),
    });
  },
  async listToCart(req, res, next) {
    SendResponseSuccess({
      res,
      message: "get list succsess",
      data: await CartService.getListUserCart(req.query.userId),
    });
  },
};
module.exports = CartController;
