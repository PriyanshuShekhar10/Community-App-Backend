const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  ImageUrl: String,
  Github: String,
  LinkedIn: String,
});

module.exports = mongoose.model("User", UserSchema);
