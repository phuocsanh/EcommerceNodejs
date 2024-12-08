"use strict";
const { BadRequestError } = require("../../src/helpers/errorResponse");
const { categoryModel } = require("../models/categories");
class CategoryService {
  static async getAllCategories() {
    const categories = await categoryModel.find();
    if (!categories) {
      throw new BadRequestError("categories not found");
    }
    return categories;
  }
}
module.exports = CategoryService;
