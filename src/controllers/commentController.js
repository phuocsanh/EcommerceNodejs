const { SendResponseSuccess } = require("../helpers/successRespone");
const CommentService = require("../services/commentService");
const CommentController = {
  async createComment(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Add comment",
      metadata: await CommentService.createComment(req.body),
    });
  },
  async getCommentsParentId(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Get comment",
      metadata: await CommentService.getCommentsByParentId(req.query),
    });
  },
};
module.exports = CommentController;
