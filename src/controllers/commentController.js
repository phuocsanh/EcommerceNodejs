const { SendResponseSuccess } = require("../helpers/successRespone");
const CommentService = require("../services/commentService");
const CommentController = {
  async createComment(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Add comment",
      data: await CommentService.createComment(req.body),
    });
  },
  async deleteComment(req, res, next) {
    SendResponseSuccess({
      res,
      message: "delete comment",
      data: await CommentService.deleteComment(req.body),
    });
  },
  async getCommentsParentId(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get comment",
      data: await CommentService.getCommentsByParentId(req.query),
    });
  },
};
module.exports = CommentController;
