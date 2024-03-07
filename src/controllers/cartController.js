const { SendResponseSuccess } = require("../helpers/successRespone");
const CartService = require("../services/cartService");

const CartController = {
  async addToCart(req, res, next) {
    SendResponseSuccess({
      res,
      message: "create new cart succsess",
      metadata: await CartService.addToCart(req.body),
    });
  },
  async update(req, res, next) {
    SendResponseSuccess({
      res,
      message: "updated cart succsess",
      metadata: await CartService.addToCartV2(req.body),
    });
  },
  async delete(req, res, next) {
    SendResponseSuccess({
      res,
      message: "deleted cart succsess",
      metadata: await CartService.deleteUserCart(req.body),
    });
  },
  async listToCart(req, res, next) {
    SendResponseSuccess({
      res,
      message: "get list succsess",
      metadata: await CartService.getListUserCart(req.query.userId),
    });
  },
};
module.exports = CartController;
