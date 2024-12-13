const { SendResponseSuccess } = require("../helpers/successRespone");
const bannserService = require("../services/bannserService");

const BannerController = {
  async getBanner(req, res, next) {
    SendResponseSuccess({
      res,
      message: "get banner succsess",
      data: await bannserService.getBanner(req.query),
    });
  },
};
module.exports = BannerController;
