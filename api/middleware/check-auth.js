const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization
      ? req.headers.authorization.split(" ")[1]
      : "";
    if (!token) {
      throw { code: 400, message: "Invalid token" };
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
