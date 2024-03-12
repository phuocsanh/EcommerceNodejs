const { SendResponseSuccess } = require("../helpers/successRespone");
const CommentService = require("../services/commentService");
const CommentController = {
  async createComment(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Add comment succsessfully",
      metadata: await CommentService.createComment(req.body),
    });
  },
};
module.exports = CommentController;
