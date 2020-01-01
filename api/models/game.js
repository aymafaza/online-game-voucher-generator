const mongoose = require("mongoose");

const gameSchema = mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true
  },
  platform: { type: String },
  createdAt: { type: Date, default: new Date() }
});

gameSchema.index({ name: "text" });

module.exports = mongoose.model("Game", gameSchema);
