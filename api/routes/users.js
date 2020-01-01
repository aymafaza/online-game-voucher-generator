const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/check-auth");
const User = require("../models/users");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
    const data = req.body;

    // Validate email by using regex function
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(String(data.email).toLowerCase())) {
      throw { code: 400, message: "Email not valid" };
    }

    // Encrypt password using hash function
    data.password = await bcrypt.hash(data.password, 10);

    const user = await User.create(data);

    res
      .status(200)
      .json({ code: 200, data: user, message: "Success create new user" });
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
    }).lean();

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
      {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ code: 200, token: token, message: "Login success" });
  } catch (error) {
    next(error);
  }
});

router.post(
  "/change-password",
  checkAuth("admin", "agent"),
  async (req, res, next) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (oldPassword === newPassword) {
        const Error = {
          code: 500,
          message: "New password cannot be the same as your old password"
        };
        throw Error;
      }

      if (newPassword !== confirmPassword) {
        const Error = {
          code: 500,
          message: "New password didn't match with confirm password"
        };
        throw Error;
      }

      // Encrypt password using hash function
      hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password in database
      const result = await User.findByIdAndUpdate(req.userData._id, {
        $set: { password: hashedPassword }
      });

      res.status(200).json({ code: 200, message: "Success change password" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
