"use strict";
const {
  BadRequestError,
  AuthFailureError,
} = require("../helpers/errorResponse");
const {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
  watchModel,
  walletBagModel,
} = require("../models/productModel");
const userModel = require("../models/userModel");
const { insertInventory } = require("../repositories/inventoryRepo");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
} = require("../repositories/productRepo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");

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
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];

    if (!productClass) {
      throw new BadRequestError(`Invalid product type ${type}`);
    }
    return new productClass(payload).updateProduct(productId);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, select: ["__v"] });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
    select = ["product_name", "product_price", "product_thumb"],
  }) {
    return await findAllProducts({ limit, sort, page, filter, select });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }

  static async findAllOrTypePublishProduct({ page, limit, product_type }) {
    // Xây dựng điều kiện tìm kiếm
    const query = {};
    if (product_type) {
      query.product_type = product_type; // Tìm theo danh mục
      query.isPublished = true; // Tìm theo isPublished
    }

    // Tính toán số lượng dữ liệu cần lấy
    const skip = (+page - 1) * +limit;

    // Lấy danh sách sản phẩm
    const products = await productModel
      .find(query) // Áp dụng điều kiện tìm kiếm
      .skip(skip) // Bỏ qua số lượng sản phẩm cho phân trang
      .limit(parseInt(limit)) // Giới hạn số lượng sản phẩm mỗi trang
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất
      .select("-isDraft -isPublished"); // Ẩn các trường không cần thiết

    // Đếm tổng số sản phẩm
    const totalProducts = await productModel.countDocuments(query);

    // Trả về kết quả
    return {
      currentPage: +page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      data: products,
    };
  }

  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
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
    const data = removeUndefinedObject(this);

    const user = await userModel.findById(this.product_shop);
    if (!user.roles.includes("SHOP")) {
      throw new BadRequestError("User not permissions");
    }
    const newProduct = await productModel.create({ ...data, _id: product_id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct?._id,
        shopId: newProduct?.product_shop,
        location: newProduct?.location,
        stock: newProduct?.product_quantity,
      });
    }
    return newProduct;
  }
  async updateProduct(productId, bodyUpdate) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: productModel,
    });
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
  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);
    if (objectParams.product_attributes) {
      await updateProductById({
        model: clothingModel,
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
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
  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        model: electronicModel,
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create furniture failed");
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: furnitureModel,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
class Watch extends Product {
  async createProduct() {
    const newWtach = await watchModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newWtach) throw new BadRequestError("create watch failed");
    const newProduct = await super.createProduct(newWtach._id);
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: watchModel,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}
class WalletBag extends Product {
  async createProduct() {
    const newWalletBag = await walletBagModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newWalletBag) throw new BadRequestError("create wallet bag failed");
    const newProduct = await super.createProduct(newWalletBag._id);
    if (!newProduct) throw new BadRequest("create product failed");

    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefinedObject(this);

    if (objectParams.product_attributes) {
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: walletBagModel,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );
    return updateProduct;
  }
}

//register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);
ProductFactory.registerProductType("WalletBag", WalletBag);
ProductFactory.registerProductType("Watch", Watch);

module.exports = ProductFactory;
