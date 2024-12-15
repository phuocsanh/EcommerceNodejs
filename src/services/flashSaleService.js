"use strict";
const { BadRequestError } = require("../helpers/errorResponse");
const flashsaleModel = require("../models/flashsaleModel");
class FlashSaleService {
  static async getFlashSaleByTime({ targetTime, limit, page }) {
    if (!targetTime) {
      const redisKey = `flash_sales:${hour}:${page}:${limit}`;
      const cachedSales = await redisClient.hGetAll(redisKey);

      if (cachedSales && Object.keys(cachedSales).length > 0) {
        return res.status(200).json({
          success: true,
          data: Object.values(cachedSales).slice(
            (page - 1) * limit,
            page * limit
          ),
        });
      }

      // Nếu không có trong Redis, truy vấn MongoDB
      const startOfHour = new Date();
      startOfHour.setMinutes(0, 0, 0);
      const endOfHour = new Date(startOfHour);
      endOfHour.setHours(startOfHour.getHours() + 1);
      const query = {
        start_time: { $gte: startOfHour },
        end_time: { $lte: endOfHour },
        is_active: true,
      };
      const flashSales = await flashsaleModel
        .find()
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ start_time: 1 });

      // Cache kết quả vào Redis
      flashSales.forEach((sale) => {
        redisClient.hSet(redisKey, {
          product_id: sale.product_id.toString(),
          sale_price: sale.sale_price,
          remaining_quantity: sale.remaining_quantity,
          start_time: sale.start_time.toISOString(),
          end_time: sale.end_time.toISOString(),
          is_active: sale.is_active,
        });
      });

      const total = await flashsaleModel.countDocuments(query);

      // Trả về kết quả
      return {
        currentPage: +page,
        totalPages: Math.ceil(total / limit),
        total,
        data: flashSales,
      };
    }
  }
  static async cacheFlashSalesByHourWithPagination() {
    try {
      const flashSales = await flashsaleModel.find({ is_active: true });

      for (const sale of flashSales) {
        const key = `flash_sale:${sale._id}`;
        await redisClient.hSet(key, {
          product_id: sale.product_id.toString(),
          sale_price: sale.sale_price,
          remaining_quantity: sale.remaining_quantity,
          start_time: sale.start_time.toISOString(),
          end_time: sale.end_time.toISOString(),
          is_active: sale.is_active,
        });

        // Đặt TTL cho Flash Sale trong Redis
        const ttl = Math.floor((new Date(sale.end_time) - new Date()) / 1000); // Đặt thời gian hết hạn
        await redisClient.expire(key, ttl);
      }

      console.log("Flash sales with pagination cached in Redis");
    } catch (error) {
      console.error(
        "Error caching flash sales by hour with pagination:",
        error
      );
    }
  }
  static async buyProductFlashSale({ flashSaleId, quantity, page, limit }) {
    const key = `flash_sale:${flashSaleId}`;
    const redisKey = `flash_sales:${page}:${limit}`;

    // Kiểm tra số lượng sản phẩm trong Redis
    const remainingQuantity = await redisClient.hGet(key, "remaining_quantity");

    if (!remainingQuantity) {
      return {
        success: false,
        message: "Flash Sale không tồn tại trong cache",
      };
    }

    if (parseInt(remainingQuantity) < quantity) {
      return { success: false, message: "Không đủ hàng" };
    }

    // Giảm số lượng trong Redis
    const updatedQuantity = await redisClient.hIncrBy(
      key,
      "remaining_quantity",
      -quantity
    );

    // Nếu số lượng còn lại <= 0, đánh dấu sản phẩm hết hàng và xóa khỏi cache phân trang
    if (updatedQuantity <= 0) {
      await redisClient.hSet(key, "is_active", "false");

      // Xóa sản phẩm khỏi cache phân trang
      const cachedSales = await redisClient.hGetAll(redisKey);

      for (const [saleId, saleData] of Object.entries(cachedSales)) {
        if (saleId === flashSaleId.toString()) {
          await redisClient.hDel(redisKey, saleId); // Xóa sản phẩm khỏi cache phân trang
          break;
        }
      }
    }

    // Lưu chi tiết cập nhật vào Redis
    const flashSaleDetails = await flashsaleModel.findById(flashSaleId);
    redisClient.hSet(key, {
      product_id: flashSaleDetails.product_id.toString(),
      sale_price: flashSaleDetails.sale_price,
      remaining_quantity: updatedQuantity,
      start_time: flashSaleDetails.start_time.toISOString(),
      end_time: flashSaleDetails.end_time.toISOString(),
      is_active: flashSaleDetails.is_active,
    });

    // Đồng bộ với MongoDB
    await flashsaleModel.updateOne(
      { _id: flashSaleId },
      { $inc: { remaining_quantity: -quantity } }
    );

    // Gửi thông báo cho các client qua Socket.io
    io.emit("flashSaleUpdate", { flashSaleId, updatedQuantity });

    return { success: true, message: "Mua hàng thành công" };
  }
}

module.exports = FlashSaleService;
