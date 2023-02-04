const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  desk: Number,
  description: String,
  present: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("device", DeviceSchema);
