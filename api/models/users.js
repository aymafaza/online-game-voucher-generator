const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  password: { type: String },
  role: {
    type: String,
    required: true,
    default: "admin",
    enum: ["admin", "agent"]
  },
  createdAt: { type: Date, default: new Date() }
});

userSchema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique."
});

module.exports = mongoose.model("User", userSchema);
