const mongoose = require("mongoose");

const KeySchema = new mongoose.Key({
  key: Number,
  holder: mongoose.Types.ObjectId,
});

module.exports = mongoose.model("key", KeySchema);
