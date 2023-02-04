const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  imageUrl: String,
  github: String,
  linkedIn: String,
  usingDevice: mongoose.SchemaTypes.ObjectId,
});

module.exports = mongoose.model("user", UserSchema);
