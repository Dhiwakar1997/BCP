const jwt = require("jsonwebtoken");
const keys = require("../config/key.config");

module.exports = {
  authenticateUser: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, keys.JwtSecret);

      req.user = decoded;

      req.apiContext = {
        apiLimit: 1000,
        used: 0,
      };

      next();
    } catch (err) {
      console.error("Token validation error:", err);
      return res.status(401).json({
        message: "Invalid or expired token",
        error: err.message,
      });
    }
  },
};
