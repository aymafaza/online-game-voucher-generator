const express = require("express");
const router = express.Router();
const Game = require("../models/game");
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

    const result = await Game.find(query)
      .populate("publisher", "name")
      .lean();
    res.status(200).json({
      code: 200,
      data: result,
      message: "Get all game"
    });
  } catch (error) {
    next(error);
  }
});

router.post("/", checkAuth("admin"), async (req, res, next) => {
  try {
    const { name, publisher } = req.body;

    result = await Game.create({ name, publisher });

    res.status(200).json({
      code: 200,
      data: result,
      message: "Post Game"
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Game.findByIdAndDelete(id);
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
