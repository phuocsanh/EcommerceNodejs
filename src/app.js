const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cors = require("cors");
const cloudinaryService = require("./services/cloudinaryService");

const { checkOverload } = require("./helpers");

const app = express();

// init middleware
// app.use(morgan("combined"));

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(compression());
// init database
require("./dbs/initMongo");
const initRedis = require("./dbs/initRedis");
initRedis.initRedis();

cloudinaryService();
// checkOverload();

// Test pub sub
// require("../src/tests/inventoryTest");
// const productTest = require("../src/tests/productTest");
// productTest.purchaseProduct("product:001", 10);

app.use(helmet());

// init routes
app.use("", require("./routes"));
// handle errors
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: -1,
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});
module.exports = app;
