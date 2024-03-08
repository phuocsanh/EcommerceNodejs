const { SendResponseSuccess } = require("../helpers/successRespone");
const InventoryService = require("../services/inventoryService");

const InventoryController = {
  async addStockInventory(req, res, next) {
    SendResponseSuccess({
      res,
      message: "Create new inventory successfully",
      metadata: await InventoryService.addStockToInventory(req.body),
    });
  },
};
module.exports = InventoryController;
