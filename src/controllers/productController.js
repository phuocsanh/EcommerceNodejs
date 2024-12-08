const ProductFactory = require("../services/productService");
const {
  SendResponseCreate,
  SendResponseSuccess,
} = require("../helpers/successRespone");
const ProductController = {
  async updateProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Update product successfully",
      data: await ProductFactory.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    });
  },
  async createProduct(req, res, next) {
    SendResponseCreate({
      res,
      message: "Create new product successfully",
      data: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    });
  },
  async unPublishProductByShop(req, res, next) {
    SendResponseCreate({
      res,
      message: "Update unpublish product successfully",
      data: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    });
  },
  async publishProductByShop(req, res, next) {
    SendResponseCreate({
      res,
      message: "Update product successfully",
      data: await ProductFactory.publishProductByShop({
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
      data: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    });
  },
  async getAllPublishForShop(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get list Publish successfully",
      data: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    });
  },
  async getlistSearchProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get list search prodcuct successfully",
      data: await ProductFactory.searchProducts(req.params),
    });
  },
  async findAllProducts(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get all prodcuct successfully",
      data: await ProductFactory.findAllProducts(req.query),
    });
  },
  async findProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Find prodcuct successfully",
      data: await ProductFactory.findProduct({
        product_id: req.params.product_id,
      }),
    });
  },
};
module.exports = ProductController;
