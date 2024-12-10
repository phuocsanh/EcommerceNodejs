const ProductFactory = require("../services/productService");
const {
  SendResponseCreate,
  SendResponseSuccess,
} = require("../helpers/successRespone");
const instanceMongoDb = require("../dbs/initMongo");
const { BadRequestError } = require("../helpers/errorResponse");
const { faker } = require("@faker-js/faker");
const { productModel } = require("../models/productModel");

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
  async findAllOrTypePublishProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get  prodcuct successfully",
      data: await ProductFactory.findAllOrTypePublishProduct(req.query),
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
  async insertFakedProduct(req, res, next) {
    if (!req.body.product_type) {
      throw new BadRequestError("Not product_type!");
    }
    if (!req.body.product_shop) {
      throw new BadRequestError("Not product_shop!");
    }
    const products = Array.from({ length: req.body.quantity || 10 }, () => ({
      product_shop: req.body.product_shop,
      product_name: faker.commerce.productName(),
      product_description: faker.commerce.productDescription(),
      product_price: faker.number.int({ min: 100000, max: 5000000 }),
      product_type: req.body.product_type,
      product_thumb: req.body.product_thumb || "",
      product_quantity: faker.number.int({ min: 100, max: 500 }),
      product_attributes: {
        brand: faker.company.name(),
        size: faker.string.fromCharacters(["S", "M", "L", "XL"]),
        material: faker.commerce.productMaterial(),
      },
    }));
    const insert = await productModel.insertMany(products);
    if (!insert) {
      SendResponseSuccess({
        res,
        message: "fakeProduct fail",
        data: [],
      });
    }
    SendResponseSuccess({
      res,
      message: "fakeProduct successfully",
      data: [],
    });
  },
};
module.exports = ProductController;
