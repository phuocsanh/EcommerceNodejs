const mongoose = require("mongoose");
const SECONDS = 5000;
const os = require("os");
const process = require("process");
const countConnect = () => {
  const numConnection = mongoose.connections.length || 0;
  console.log("Number of connections MongoDB", numConnection);
};
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length || 0;
    const numCores = os.cpus().length;

    const memoryUsage = process.memoryUsage().rss;
    const maxConnections = numCores * 5;

    console.log("Active connections:", numConnection);
    console.log(`Memory usage:', ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection === maxConnections - 5) {
      console.log("Connection overload!");
    }
  }, SECONDS);
};
module.exports = {
  countConnect,
  checkOverload,
};
