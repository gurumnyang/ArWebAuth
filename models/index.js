const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.user = require("./user.model");
db.market = require("./market.model");
db.stamp = require("./stamp.model");
db.stampPolicy = require("./stampRule");

module.exports = db;