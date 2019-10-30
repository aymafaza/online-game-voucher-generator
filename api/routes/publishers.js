const express = require("express");
const router = express.Router();
const Publisher = require("../models/publishers");
const checkAuth = require("../middleware/check-auth");

router.get("/", checkAuth("admin"), async (req, res, next) => {
  try {
    const { id, keywords } = req.query;
    // Create query
    let query = {};
    if (id) {
      query["_id"] = id;
    }
    // Search query
    if (keywords) {
      query["$or"] = [
        { $text: { $search: keywords } },
        { name: { $regex: keywords } }
      ];
    }

    const result = await Publisher.find(query).lean();
    res.status(200).json({
      code: 200,
      data: result,
      message: "Get all publisher"
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", checkAuth("admin"), async (req, res, next) => {
  try {
    const { name } = req.body;

    result = await Publisher.create({ name });

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
