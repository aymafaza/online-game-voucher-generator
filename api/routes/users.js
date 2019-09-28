const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const data = req.body;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!emailRegex.test(String(data.email).toLowerCase())) {
      throw { code: 400, message: "Email not valid" };
    }

    data.password = await bcrypt.hash(data.password, 10);

    const result = await User.create(data);
    res
      .status(200)
      .json({ code: 200, data: result, message: "Success create new user" });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username } = req.body;
    let { password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      throw { code: 400, message: "Invalid username or email" };
    }

    // Compare password
    isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw { code: 400, message: "Wrong password" };
    }

    // Create token
    const token = jwt.sign(
      { username: user.username, email: user.email, role: user.role },
      "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ code: 200, data: token, message: "Login success" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
