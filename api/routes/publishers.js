const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Publisher = require("../models/publishers");

router.get("/", async (req, res, next) => {
  try {
    const result = await Publisher.find();
    res.status(200).json({
      code: 200,
      data: result,
      message: "Get all publisher"
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Publisher.findById(id);
    res.status(200).json({
      code: 200,
      data: result,
      message: "Get publisher by id"
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;

    const publisher = new Publisher({
      _id: new mongoose.Types.ObjectId(),
      name
    });

    result = await publisher.save();

    res.status(200).json({
      code: 200,
      data: result,
      message: "Post publisher"
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Publisher.findByIdAndDelete(id);
    let message = "1 Row deleted";
    if (!result) {
      message = "Data not found 0 row deleted";
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
