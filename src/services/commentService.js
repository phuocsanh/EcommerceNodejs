"use strict";
const {
  NotFoundError,
  BadRequestError,
} = require("../../src/helpers/errorResponse");
const commentModel = require("../models/commentModel");
const { mongoObjectId } = require("../utils");

class CommentService {
  static async createComment({ productId, userId, content, commentparentId }) {
    const comment = new commentModel({
      commemt_productId: productId,
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
          commemt_productId: mongoObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await commentModel.updateMany(
        {
          commemt_productId: mongoObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          commemt_productId: mongoObjectId(productId),
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
}
module.exports = CommentService;
