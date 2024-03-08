const redisPubsubService = require("../services/redisPubsubService");
class InventoryServiceTest {
  constructor() {
    redisPubsubService.subscribe("purchase_events", (channel, message) => {
      InventoryServiceTest.updateInventory(message);
    });
  }
  static async updateInventory(productId, quantity) {
    console.log(`update inventory ${productId} with quantity ${quantity}`);
  }
}
module.exports = new InventoryServiceTest();
