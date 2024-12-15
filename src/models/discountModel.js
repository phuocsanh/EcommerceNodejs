"use strict";
const mongoose = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "discounts";
const DOCUMENT_NAME = "discountModel";
// Declare the Schema of the Mongo model
const discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      require: true,
    }, // Tên
    discount_description: {
      type: String,
      require: true,
    }, // Mô tả
    discount_type: {
      type: String,
      default: "FIXED",
      enum: ["PERCENT", "FIXED"],
    }, // loại
    discount_value: { type: Number, require: true }, // Giá trị
    discount_code: { type: String, require: true }, // Mã
    discount_start_date: { type: Date, require: true }, // Ngày bắt đầu
    discount_end_date: { type: Date, require: true }, // Ngày kết thúc
    discount_max_uses: { type: Number, require: true }, // Số lượng discount dc áp dụng
    discount_max_value: { type: Number, require: true }, // Giá trị tối đa
    discount_uses_count: { type: Number, require: true }, // Số discount đã sử dụng
    discount_user_used: { type: Array, default: [] }, // Ai đã sử dụng
    discount_max_uses_per_user: { type: Number, require: true }, // Số lượng cho phép tối đa dc sử dụng bởi một user
    discount_min_order_value: { type: Number, require: true }, // Giá trị đơn hàng tối thiểu dc sử dụng
    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      require: "shopModel",
    }, // id của shop tạo
    discount_is_active: { type: Boolean, require: true }, // Trạng thái của discount có được sử dụng hay không
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    }, // Cho phép áp dụng cho tất cả sản phẩm hay cho sản phẩm chỉ định
    discount_product_ids: { type: Array, default: [] }, // Số sản phẩm dc áp dụng
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
