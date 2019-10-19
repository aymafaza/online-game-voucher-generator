const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String },
  role: {
    type: String,
    required: true,
    default: "admin",
    enum: ["admin", "agent"]
  }
});

module.exports = mongoose.model("User", userSchema);
