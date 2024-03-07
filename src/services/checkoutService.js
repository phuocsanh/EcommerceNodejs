"use strict";
const {
  NotFoundError,
  BadRequestError,
} = require("../../src/helpers/errorResponse");
const { findCartById } = require("../repositories/cartRepo");
const { checkProductByServer } = require("../repositories/productRepo");
const DiscountService = require("./discountService");
class CheckoutService {
  static async checkoutReview({ cartId, userId, shop_order_ids }) {
    // check login or no login
    /*
		{
			cartId,
			userId,
			shop_order_ids:[{
				shopId,
				shop_discounts:[],
				item_products:[{
					price,
					quantity,
					productId
				}]
				},{
				shopId,
				shop_discounts:[{
					shopId,
					discountId,
					codeId
				}],
				item_products:[{
					price,
					quantity,
					productId
				}]
				}
			]

		} 
	 */
    // check cart id có tồn tại không
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError("Cart does not exists");
    const checkout_oder = {
        totalPrice: 0, //Tổng tiển hàng
        feeShip: 0, // Phí vận chuyển
        totalDiscount: 0, //Tổng tiền Discount giảm giá
        totalCheckout: 0, //Tổng thanh toán
      },
      shop_order_ids_new = [];
    // Tính tiền tổng đơn
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      // Check product is available
      const checkProductServer = await checkProductByServer(item_products);

      if (!checkProductServer[0]) throw new BadRequestError("Order wrong!");

      // Tính tổng tiền đơn hàng
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      // Tổng tiền trước khi xử lý
      checkout_oder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice, // Tiền trước khi giảm giá
        priceApplyDisscount: checkoutPrice,
        item_products: checkProductServer,
      };
      // Nếu shop_discount tồn tại lớn hơn 0
      if (shop_discounts.length) {
        // Giả sử chỉ có một discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } =
          await DiscountService.getDiscountAmount({
            codeId: shop_discounts[0].codeId,
            userId,
            shopId,
            products: checkProductServer,
          });

        // Tổng disscount giảm giá
        checkout_oder.totalDiscount += discount;

        // Nếu tiền giảm giá lớn hơn 0
        if (discount > 0) {
          itemCheckout.priceApplyDisscount = checkoutPrice - discount;
        }
      }
      // Tổng thanh toán cuối cùng
      checkout_oder.totalCheckout += itemCheckout.priceApplyDisscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_oder,
    };
  }
  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_oder } =
      await CheckoutService.checkoutReview({ cartId, userId, shop_order_ids });
    // Check lại một lần nữa xem vượt tồn kho hay không
    // get new array products
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log("🚀 ~ CheckoutService ~ product:", products);
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
    }
  }
}
module.exports = CheckoutService;
