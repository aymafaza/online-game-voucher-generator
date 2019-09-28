const express = require("express");
const router = express.Router();
const Voucher = require("../models/vouchers");

router.get("/", async (req, res, next) => {
  try {
    const result = await Voucher.findOneAndUpdate(
      {
        generated: { $ne: true }
      },
      { $set: { generated: true } }
    ).populate("publisher", "_id name");
    let message;
    if (result) {
      message = "GET all voucher";
    } else {
      message = "Out of stock";
    }
    res.status(200).json({
      code: 200,
      data: result,
      message
    });
  } catch (error) {
    next(error);
  }
});

router.get("/predict", async (req, res, next) => {
  try {
    const result = await Voucher.findOne({
      generated: { $ne: true }
    })
      .select("sellingPrice buyingPrice")
      .populate("publisher", "_id name");

    let message;
    if (result) {
      message = "GET all voucher";
    } else {
      message = "Out of stock";
    }
    res.status(200).json({
      code: 200,
      data: result,
      message
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
