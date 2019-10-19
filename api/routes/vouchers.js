const express = require("express");
const router = express.Router();
const Voucher = require("../models/vouchers");
const Publisher = require("../models/publishers");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth("admin"), async (req, res, next) => {
  try {
    const result = await Voucher.find()
      .populate("publisher", "name")
      .populate("addedBy", "username")
      .populate("generatedBy", "username");
    res.status(200).json({
      code: 200,
      data: result,
      message: "GET all voucher"
    });
  } catch (error) {
    next(error);
  }
});

router.get("/user", checkAuth("admin"), async (req, res, next) => {
  try {
    const result = await Voucher.find({ generatedBy: req.userData._id })
      .populate("publisher", "name")
      .populate("addedBy", "username")
      .populate("generatedBy", "username");
    res.status(200).json({
      code: 200,
      data: result,
      message: "GET all voucher"
    });
  } catch (error) {
    next(error);
  }
});

router.get("/generate", checkAuth("admin"), async (req, res, next) => {
  try {
    // Add id generated user
    const result = await Voucher.findOneAndUpdate(
      {
        generated: { $ne: true }
      },
      {
        $set: {
          generated: true,
          generatedBy: req.userData._id,
          updatedAt: Date.now()
        }
      }
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

router.get("/checkprice", checkAuth("admin"), async (req, res, next) => {
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

router.get("/:id", async (req, res, next) => {
  try {
    const result = await Voucher.findById(req.params.id)
      .populate("publisher", "name")
      .populate("addedBy", "username")
      .populate(" ", "username");
    res.status(200).json({
      code: 200,
      data: result,
      message: "GET all voucher"
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", checkAuth("admin"), async (req, res, next) => {
  try {
    let result;
    let data = req.body;
    // If input is array then do bulk insert
    if (Array.isArray(req.body)) {
      let failed = null;
      // Add user id to every inserted data
      const insertData = data.map(async val => {
        const newData = { ...val, addedBy: req.userData._id };

        const isPublisherValid = await Publisher.findById({
          _id: newData.publisher
        });

        if (!isPublisherValid) {
          // throw { status: 400, message: "Invalid Publisher ID" };
          failed.push({ ...newData, errorMessage: "Invalid Publisher ID" });
          return;
        }

        // Add user id to inserted data
        result = await Voucher.create(newData);
        return newData;
      });

      const success = await Promise.all(insertData);

      // Filter only success insert
      result = {
        success: success.filter(val => val),
        failed
      };
    } else {
      // Validate voucher publisher by id
      const isPublisherValid = await Publisher.findById({
        _id: data.publisher
      });

      if (!isPublisherValid) {
        throw { status: 400, message: "Invalid Publisher ID" };
      }

      // Add user id to inserted data
      result = {
        success: await Voucher.create({ ...data, addedBy: req.userData._id }),
        failed: null
      };
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
