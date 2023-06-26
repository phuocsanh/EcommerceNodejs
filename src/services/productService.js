"use strict";
const { BadRequestError } = require("../helpers/errorResponse");
const {
  productModel,
  clothingModel,
  electronicModel,
} = require("../models/productModel");
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronic":
        return new Electronic(payload).createProduct();
      default:
        throw new BadRequestError(`Unknown ${type}`);
    }
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
  async createProduct() {
    return await productModel.create(this);
  }
}

//define sub-class for different product attributes
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("create clothing failed");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }
}
//define sub-class for different product attributes
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create(this.product_attributes);
    if (!newElectronic) throw new BadRequestError("create electronic failed");
    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }
}

module.exports = ProductFactory;
