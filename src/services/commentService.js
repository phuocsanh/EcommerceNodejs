"use strict";
const {
  NotFoundError,
  BadRequestError,
} = require("../../src/helpers/errorResponse");
const commentModel = require("../models/commentModel");
const { findProduct } = require("../repositories/productRepo");
const { mongoObjectId } = require("../utils");

class CommentService {
  static async createComment({ productId, userId, content, commentparentId }) {
    const comment = new commentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: commentparentId,
    });
    let rightValue;
    if (commentparentId) {
      //reply comment
      const parentComment = await commentModel.findById(commentparentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");
      rightValue = parentComment.comment_right;
      // update many
      await commentModel.updateMany(
        {
          comment_productId: mongoObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await commentModel.updateMany(
        {
          comment_productId: mongoObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: mongoObjectId(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    // insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }
  static async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");
      const comments = await commentModel
        .find({
          comment_productId: mongoObjectId(productId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({ comment_left: 1 });
      return comments;
    }
    const comments = await commentModel
      .find({
        comment_productId: mongoObjectId(productId),
        comment_parentId: parentCommentId,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({ comment_left: 1 });
    return comments;
  }
  static async deleteComment({ productId, commentId }) {
    const foundProduct = await findProduct({ product_id: productId });
    if (!foundProduct) throw new NotFoundError("product not found");
    const comment = await commentModel.findById(commentId);
    if (!comment) throw new NotFoundError("comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    // Tính width
    const width = rightValue - leftValue + 1;
    // Xoá tất cả commentId con
    await commentModel.deleteMany({
      comment_productId: mongoObjectId(productId),
      comment_left: { $gte: leftValue, $lte: rightValue },
    });
    // cập nhật giá trị left và right còn lại
    await commentModel.updateMany(
      {
        comment_productId: mongoObjectId(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );
    await commentModel.updateMany(
      {
        comment_productId: mongoObjectId(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );
    return true;
  }
}
module.exports = CommentService;
