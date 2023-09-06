const ProductFactory = require("../services/productService");
const {
  SendResponseCreate,
  SendResponseSuccess,
} = require("../helpers/successRespone");
const { publishProductByShop } = require("../services/productService");
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
  async unPublishProductByShop(req, res, next) {
    SendResponseCreate({
      res,
      message: "Update unpublish product successfully",
      metadata: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    });
  },
  async publishProductByShop(req, res, next) {
    SendResponseCreate({
      res,
      message: "Update product successfully",
      metadata: await ProductFactory.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    });
  },

  /**
   * getAllDraftsForShop to get list draft
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllDraftsForShop(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get list Draft successfully",
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    });
  },
  async getAllPublishForShop(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get list Publish successfully",
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    });
  },
  async getlistSearchProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get list search prodcuct successfully",
      metadata: await ProductFactory.searchProducts(req.params),
    });
  },
  async findAllProducts(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get all prodcuct successfully",
      metadata: await ProductFactory.findAllProducts(req.query),
    });
  },
};
module.exports = ProductController;
