const mongoose = require("mongoose");

const publisherSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true }
});

publisherSchema.index({ name: "text" });

module.exports = mongoose.model("Publisher", publisherSchema);
