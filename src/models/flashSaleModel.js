const mongoose = require("mongoose");
const COLLECTION_NAME = "flash_sales";
const DOCUMENT_NAME = "flashSaleModel";
const flashSaleSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    }, // Tham chiếu tới sản phẩm
    sale_price: { type: Number, required: true }, // Giá Flash Sale
    start_time: { type: Date, required: true }, // Thời gian bắt đầu
    end_time: { type: Date, required: true }, // Thời gian kết thúc
    total_quantity: { type: Number, required: true }, // Tổng số lượng Flash Sale
    remaining_quantity: { type: Number, required: true }, // Số lượng còn lại
    is_active: { type: Boolean, default: true }, // Trạng thái hoạt động
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, flashSaleSchema);
