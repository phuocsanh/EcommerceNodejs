"use strict";

const { BadRequestError } = require("../helpers/errorResponse");
const flashsaleModel = require("../models/flashsaleModel");
const redisClient = require("../helpers/redisClient"); // Kết nối Redis
const io = require("../helpers/socketio"); // Socket.io instance

class FlashSaleService {
  // Lấy danh sách Flash Sale theo giờ (phân trang, cache Redis)
  static async getFlashSaleByTime({ targetTime, limit, page }) {
    if (!targetTime) {
      throw new BadRequestError("Thời gian targetTime là bắt buộc.");
    }

    const startTime = new Date(targetTime);
    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1);

    const redisKey = `flash_sales:${startTime.toISOString()}:${page}:${limit}`;

    // Kiểm tra dữ liệu cache trong Redis
    const cachedSales = await redisClient.get(redisKey);
    if (cachedSales) {
      return JSON.parse(cachedSales);
    }

    // Nếu không có cache, truy vấn MongoDB
    const query = {
      start_time: { $gte: startTime },
      end_time: { $lte: endTime },
      is_active: true,
    };

    const flashSales = await flashsaleModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ start_time: 1 });

    const total = await flashsaleModel.countDocuments(query);

    const result = {
      currentPage: +page,
      totalPages: Math.ceil(total / limit),
      total,
      data: flashSales,
    };

    // Cache kết quả trong Redis với TTL (thời gian sống)
    await redisClient.set(redisKey, JSON.stringify(result), {
      EX: 3600, // Cache trong 1 giờ
    });

    return result;
  }

  // Cập nhật và cache danh sách Flash Sale
  static async cacheFlashSalesByHourWithPagination() {
    try {
      const flashSales = await flashsaleModel.find({ is_active: true });

      for (const sale of flashSales) {
        const key = `flash_sale:${sale._id}`;

        // Cache thông tin chi tiết sản phẩm
        await redisClient.hSet(key, {
          product_id: sale.product_id.toString(),
          sale_price: sale.sale_price,
          remaining_quantity: sale.remaining_quantity,
          start_time: sale.start_time.toISOString(),
          end_time: sale.end_time.toISOString(),
          is_active: sale.is_active,
        });

        // Đặt TTL (thời gian hết hạn) trong Redis
        const ttl = Math.floor((new Date(sale.end_time) - new Date()) / 1000);
        await redisClient.expire(key, ttl);
      }

      console.log("Flash sales cached in Redis.");
    } catch (error) {
      console.error("Error caching flash sales:", error);
    }
  }

  // Mua sản phẩm Flash Sale
  static async buyProductFlashSale({ flashSaleId, quantity }) {
    const key = `flash_sale:${flashSaleId}`;

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

    // Giảm số lượng sản phẩm trong Redis
    const updatedQuantity = await redisClient.hIncrBy(
      key,
      "remaining_quantity",
      -quantity
    );

    // Nếu hết hàng, cập nhật trạng thái
    if (updatedQuantity <= 0) {
      await redisClient.hSet(key, "is_active", "false");
    }

    // Đồng bộ với MongoDB
    await flashsaleModel.updateOne(
      { _id: flashSaleId },
      { $inc: { remaining_quantity: -quantity } }
    );

    // Gửi thông báo cho client qua Socket.io
    io.emit("flashSaleUpdate", { flashSaleId, updatedQuantity });

    return { success: true, message: "Mua hàng thành công" };
  }
}

module.exports = FlashSaleService;
