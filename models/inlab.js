const mongoose = require("mongoose");

const inLabSchema = new mongoose.Schema({
  user: Object,
});

module.exports = mongoose.model("inlab", inLabSchema);
