const { BadRequestError } = require("../helpers/errorResponse");
const bannerModel = require("../models/bannerModel");

const bannserService = {
  async getBanner({ type_app }) {
    let query = {
      type_app,
    };
    const data = await bannerModel.find(query).lean();
    if (!data) {
      throw new BadRequestError("Could not find banner");
    }
    return data;
  },
};
module.exports = bannserService;
