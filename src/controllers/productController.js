const ProductFactory = require("../services/productService");
const {
  SendResponseCreate,
  SendResponseSuccess,
} = require("../helpers/successRespone");
const ProductController = {
  async createProduct(req, res, next) {
    new SendResponseCreate({
      res,
      message: "Create new product successfully",
      metadata: await ProductFactory.createProduct(req.body.type, req.body),
    });
  },
};
module.exports = ProductController;
