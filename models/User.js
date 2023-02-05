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
});

module.exports = mongoose.model("user", UserSchema);
