"use strict";
const {
  NotFoundError,
  BadRequestError,
} = require("../../src/helpers/errorResponse");
const notificationtModel = require("../models/notificationtModel");
const { mongoObjectId } = require("../utils");

class NotificationService {
  static async pushNotiToSystem({
    type = "SHOP-001",
    receieveId = 1,
    senderId = 1,
    options = {},
  }) {
    let noti_content;
    if (type === "SHOP-001") {
      noti_content = "@@@ Vừa mới thêm sản phẩm mới";
    } else if (type === "PROMOTION-001") {
      noti_content = "@@@ Vừa mới thêm Voucher mới";
    }
    const newNoti = notificationtModel.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receiveId: receieveId,
      noti_content: noti_content,
      noti_options: options,
    });
    await newNoti.save();
    return newNoti;
  }
}
module.exports = NotificationService;
