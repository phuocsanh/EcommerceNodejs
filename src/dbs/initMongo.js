"use strict";

const mongoose = require("mongoose");
const {
  db: { host, name, port },
} = require("../configs/configConnect");
const connectString = `mongodb://${host}:${port}/${name}`;
const { countConnect } = require("../helpers");

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    // if (1 === 1) {
    //   mongoose.set("debug", true);
    //   mongoose.set("debug", { color: true });
    // }
    mongoose
      .connect(connectString, { maxPoolSize: 50 })
      .then(() => {
        console.log("Connect MongoDB successfully");
        // countConnect();
      })
      .catch((err) => console.log("Connect MongoDB", err));
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}
// const db = new Database();
const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
