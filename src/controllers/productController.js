const ProductFactory = require("../services/productService");
const {
  SendResponseCreate,
  SendResponseSuccess,
} = require("../helpers/successRespone");
const ProductController = {
  async createProduct(req, res, next) {
    SendResponseCreate({
      res,
      message: "Create new product successfully",
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    });
  },
};
module.exports = ProductController;
