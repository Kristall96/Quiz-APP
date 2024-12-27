import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "moderator", "publisher", "user"],
    default: "user",
  },
  address: { type: String },
  postCode: { type: String },
  phone: { type: Number },
});

const User = mongoose.model("User", userSchema);
export default User;
