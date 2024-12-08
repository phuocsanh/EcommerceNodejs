const { SendResponseSuccess } = require("../helpers/successRespone");
const CategoryService = require("../services/categoriesService");

const CategoryController = {
  async getAllCategories(req, res, next) {
    SendResponseSuccess({
      res,
      message: "checkout review succsess",
      data: await CategoryService.getAllCategories(req.body),
    });
  },
};
module.exports = CategoryController;
