const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  postCode: { type: String },
  phone: { type: Number },
  role: { type: String },
});

module.exports = mongoose.model("User", userSchema);
