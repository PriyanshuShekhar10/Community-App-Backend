const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: "user" },
  imageUrl: String,
  github: String,
  linkedIn: String,
  usingDevice: mongoose.SchemaTypes.ObjectId,
  hasKey1: { type: Boolean, default: false },
  hasKey2: { type: Boolean, default: false },
  inLab: { type: Boolean, default: false },
});

module.exports = mongoose.model("user", UserSchema);
