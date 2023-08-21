"use strict";
const { BadRequestError } = require("../helpers/errorResponse");
const {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
} = require("../models/productModel");
const { findAllDraftsForShop } = require("../models/repositories/productRepo");
class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid product type ${type}`);
    }
    return new productClass(payload).createProduct();
  }
  static async publishProductByShop({ product_shop, product_id }) {}
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }
}

//define base product
class Product {
  constructor({
    product_name,
    product_price,
    product_thumb,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_price = product_price),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }
  async createProduct(product_id) {
    return await productModel.create({ ...this, _id: product_id });
  }
}

//define sub-class for different product attributes
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create clothing failed");
    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }
}
//define sub-class for different product attributes
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw new BadRequestError("create electronic failed");
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create furniture failed");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }
}

//register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
