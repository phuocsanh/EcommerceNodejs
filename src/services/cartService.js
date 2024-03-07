"use strict";
const { NotFoundError } = require("../../src/helpers/errorResponse");
const cartModel = require("../models/cartModel");
const { getProductById } = require("../repositories/productRepo");
class CartService {
  static async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }
  static async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;

    const query = {
        cart_userId: userId,
        "cart_products.productId": productId,
        cart_state: "active",
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity, //cart_products.$.quantity dấu $ sẽ update chính phần tử đó
        },
      },
      options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }
  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cart_userId: userId });
    //check Cart có tồn tại hay không
    if (!userCart) {
      return await CartService.createUserCart({ userId, product });
    }
    // Nếu có giỏ hàng rồi nhưng chưa có sản phẩm
    if (!userCart.cart_count_product.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }
    // Nếu giở hàng tồn tại và có sản phẩm này thì update quantity
    return await CartService.updateUserCartQuantity({ userId, product });
  }

  // update cart
  /*
    shop_oder_ids:[
      {
        shopId,
        item_products:[{
          quantity,
          price,
          shopId,
          old_quantity,
          productId,
        }],
        version
      }
    ]
  */
  static async addToCartV2({ userId, shop_oder_ids }) {
    const { productId, old_quantity, quantity } =
      shop_oder_ids[0]?.item_products[0];

    const foundProduct = await getProductById(productId);
    if (!foundProduct) throw NotFoundError("Not found product");
    //compare
    if (foundProduct.product_shop.toString() !== shop_oder_ids[0].shopId) {
      throw NotFoundError("Product do not belong to shop");
    }
    if (quantity === 0) {
      //delete
    }
    return await CartService.updateUserCartQuantity({
      userId,
      product: { productId, quantity: quantity - old_quantity },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateSet = {
      $pull: { cart_products: { productId: productId } },
    };

    const deleteCart = await cartModel.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart(userId) {
    return await cartModel.findOne({ cart_userId: userId }).lean();
  }
}
module.exports = CartService;
