const redisPubsubService = require("../services/redisPubsubService");
class ProductServiceTest {
  purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    redisPubsubService.publish("purchase_events", JSON.stringify(order));
  }
}
module.exports = new ProductServiceTest();
