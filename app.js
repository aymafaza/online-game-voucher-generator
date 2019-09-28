const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

const voucherRoutes = require("./api/routes/vouchers");
const publisherRoutes = require("./api/routes/publishers");
const generateRoutes = require("./api/routes/generate");
const userRoutes = require("./api/routes/users");

mongoose.connect(
  "mongodb+srv://vouchers:12345@recontest-2ep8u.mongodb.net/test",
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/vouchers", voucherRoutes);
app.use("/generate", generateRoutes);
app.use("/user", userRoutes);
app.use("/publishers", publisherRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    code: error.status || 500,
    message: error.message
  });
});

module.exports = app;
