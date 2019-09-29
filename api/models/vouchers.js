const mongoose = require("mongoose");

const voucherSchema = mongoose.Schema({
  publisher: { type: mongoose.Schema.Types.ObjectId, ref: "Publisher" },
  key: { type: String, required: true },
  buyingPrice: { type: Number, default: 0 },
  sellingPrice: { type: Number, default: 0 },
  generated: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  insertedAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("Voucher", voucherSchema);
