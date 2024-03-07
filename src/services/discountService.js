"use strict";
const {
  BadRequestError,
  NotFoundError,
} = require("../../src/helpers/errorResponse");
const discountModel = require("../models/discountModel");
const {
  findAllDiscountCodesUnselect,
  checkDiscountExist,
} = require("../repositories/discountRepo");
const { findAllProducts } = require("../repositories/productRepo");
const { mongoObjectId } = require("../utils");
// 1 Generator Discount Code 'Shop | Admin'

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      max_uses_per_user,
      uses_count,
      users_used,
    } = payload;

    if (
      new Date() > new Date(start_date) ||
      new Date() > new Date(end_date) ||
      new Date(start_date) > new Date(end_date)
    ) {
      throw new BadRequestError("Date invalid");
    }

    const founDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: mongoObjectId(shopId),
      })
      .lean();

    if (founDiscount && founDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists!");
    }

    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_shopId: shopId,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_type: type,
      discount_user_used: users_used,
      discount_uses_count: uses_count,
      discount_max_uses: max_uses,
      discount_applies_to: applies_to,
      discount_is_active: is_active,
      discount_min_order_value: min_order_value || 0,
      discount_value: value,
      discount_code: code,
      discount_max_value: max_value,
      discount_max_uses_per_user: max_uses_per_user,
    });
    return newDiscount;
  }
  static async updatdeDiscountCode() {}

  static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: mongoObjectId(shopId),
      })
      .lean();
    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exists!");
    }
    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all product
      products = await findAllProducts({
        filter: { product_shop: mongoObjectId(shopId), isPublished: true },
        limit: +limit,
        sort: "ctime",
        page: +page,
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      // get product_ids
      products = await findAllProducts({
        filter: { _id: { $in: discount_product_ids }, isPublished: true },
        limit: +limit,
        sort: "ctime",
        page: +page,
        select: ["product_name"],
      });
    }
    return products;
  }

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: mongoObjectId(shopId),
        discount_is_active: true,
      },
      unSelect: ["_v", "discount_shopId"],
      model: discountModel,
    });
    return discounts;
  }
  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: mongoObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new NotFoundError(`discount doesn't exits`);

    const {
      discount_is_active,
      discount_max_uses,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_user_used,
      discount_type,
      discount_value,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("discount expried");

    if (!discount_max_uses) throw new NotFoundError("discount are out");

    if (new Date() > new Date(discount_end_date)) {
      throw new NotFoundError("discount code has expried");
    }
    // check xem có xét giá trị tối thiểu không
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `discount required a minium order value of ${discount_min_order_value} `
        );
      }
    }
    if (discount_max_uses_per_user > 0) {
      const userUserDiscount = discount_user_used.find(
        (user) => user.userId === userId
      );
      if (userUserDiscount) {
        throw new NotFoundError(
          `This discount is the number of uses has expired`
        );
      }
    }
    // Check xem discount này là fixed_amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }
  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discountModel.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: mongoObjectId(shopId),
    });
    return deleted;
  }
  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shopId: mongoObjectId(shopId),
      },
    });
    if (!foundDiscount) throw new NotFoundError(`discount doesn't exits`);
    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_user_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });
    return result;
  }
}
module.exports = DiscountService;
