const express = require("express");
const router = express.Router();
const Voucher = require("../models/vouchers");
const Publisher = require("../models/publishers");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth("admin"), async (req, res, next) => {
  try {
    const result = await Voucher.find().populate("publisher", "_id name");

    res.status(200).json({
      code: 200,
      data: result,
      message: "GET all voucher"
    });
  } catch (error) {
    next(error);
  }
});

// router.get("/:id", (req, res, next) => {
//   const { id } = req.params;
//   res.status(200).json({
//     code: 200,
//     data: id,
//     message: "GET voucher by id"
//   });
// });

router.get("/generate", async (req, res, next) => {
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

router.get("/next", async (req, res, next) => {
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

router.post("/", async (req, res, next) => {
  try {
    let result;
    const data = req.body;
    // If input is array then do bulk insert
    if (Array.isArray(req.body)) {
      result = await Voucher.insertMany(data);
    } else {
      const { publisher, key, buyingPrice, sellingPrice, generated } = req.body;

      const isPublisherValid = await Publisher.findById({
        _id: publisher
      }).exec();

      if (!isPublisherValid) {
        throw { status: 400, message: "Invalid Publisher ID" };
      }

      result = await Voucher.create(data);
    }

    res.status(200).json({
      code: 200,
      data: result,
      message: "POST voucher"
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
