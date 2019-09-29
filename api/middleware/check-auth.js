const jwt = require("jsonwebtoken");

module.exports = (...allowedRoles) => {
  try {
    return (req, _, next) => {
      // Get user token from authorization headers (split "Bearer" + "....")
      const token = req.headers.authorization
        ? req.headers.authorization.split(" ")[1]
        : "";

      if (!token) {
        throw { code: 400, message: "Invalid token" };
      }

      // Verify user jwt token
      const decodedUserData = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // Function to check if role in user token are in allowed roles
      const isAllowed = role => allowedRoles.indexOf(role) > -1;

      if (!isAllowed(decodedUserData.role)) {
        throw { code: 200, message: "Unauthorized user role" };
      }

      req.userData = decodedUserData;
      next();
    };
  } catch (error) {
    next(error);
  }
};
