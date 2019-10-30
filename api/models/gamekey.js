const mongoose = require("mongoose");

const gameKeySchema = mongoose.Schema({
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Publisher",
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true
  },
  key: { type: String, required: true },
  buyingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  generated: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  insertedAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Gamekey", gameKeySchema);
