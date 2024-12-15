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
      message: "Thành công!",
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
      message: "Thành công!",
      data: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    });
  },
  async unPublishProductByShop(req, res, next) {
    SendResponseCreate({
      res,
      message: "Thành công!",
      data: await ProductFactory.unPublishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    });
  },
  async publishProductByShop(req, res, next) {
    SendResponseCreate({
      res,
      message: "Thành công!",
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
      message: "Thành công!",
      data: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    });
  },
  async getAllPublishForShop(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Thành công!",
      data: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    });
  },
  async getlistSearchProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Thành công!",
      data: await ProductFactory.searchProducts(req.params),
    });
  },
  async findAllProducts(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Thành công!",
      data: await ProductFactory.findAllProducts(req.query),
    });
  },
  async findAllOrTypePublishProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Thành công!",
      data: await ProductFactory.findAllOrTypePublishProduct(req.query),
    });
  },
  async getProductsByDiscount(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Thành công!",
      data: await ProductFactory.getProductsByDiscount(req.query),
    });
  },
  async getProductsBySelled(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Thành công!",
      data: await ProductFactory.getProductsBySelled(req.query),
    });
  },
  async findProduct(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Thành công!",
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
    function roundUpToEven(value) {
      return Math.ceil(value / 2) * 2;
    }

    const products = Array.from({ length: req.body.quantity || 10 }, () => {
      const discount = faker.number.int({ min: 10, max: 30 });
      const price = faker.number.int({ min: 100000, max: 5000000 });

      return {
        product_shop: req.body.product_shop,
        product_name: faker.commerce.productName(),
        product_description: faker.commerce.productDescription(),
        product_ratingsAverage: faker.number.float({
          multipleOf: 0.5,
          min: 1,
          max: 5,
        }),
        product_price: price,
        product_type: req.body.product_type,

        discount: discount,

        product_discountedPrice: roundUpToEven(
          price - (price * discount) / 100
        ),
        product_selled: faker.number.int({ min: 10, max: 2000 }),
        product_thumb: req.body.product_thumb || "",
        product_quantity: faker.number.int({ min: 100, max: 500 }),
        product_attributes: {
          brand: faker.company.name(),
          size: faker.string.fromCharacters(["S", "M", "L", "XL"]),
          material: faker.commerce.productMaterial(),
        },
      };
    });
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
