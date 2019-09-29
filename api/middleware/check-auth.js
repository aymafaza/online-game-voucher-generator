const jwt = require("jsonwebtoken");

module.exports = (...role) => {
  try {
    return (req, _, next) => {
      const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";
      if (!token) {
        throw { code: 400, message: "Invalid token" };
      }
      const decodedUserData = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const isAllowed = roles => role.indexOf(roles) > -1;
      if (!isAllowed(decodedUserData.role)) {
        throw { code: 200, message: "Unauthorized" };
      }
      req.userData = decodedUserData;
      next();
    };
  } catch (error) {
    next(error);
  }
};
