const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const keys = require("../config/key.config");

module.exports = {
  createUser: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const user = req.user;

      const token = jwt.sign(
        {
          id: user._id,
          name: user.Username,
          email: user.UserEmail,
        },
        keys.JwtSecret,
        { expiresIn: "1h" }
      );

      const apiContext = {
        apiLimit: 1000,
        used: 0,
      };

      return res.status(200).json({
        message: "Google authentication successful",
        token,
        user: {
          id: user._id,
          name: user.Username,
          email: user.UserEmail,
        },
        context: apiContext,
      });
    } catch (err) {
      console.error("Error creating user:", err);
      return res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    }
  },
  logInUser: async (req, res) => {},
  getApiLimitAvaible: async (req, res) => {},
  getKeyAssigned: async (req, res) => {},
  extendFreeLimit: async (req, res) => {},
  managekey: async (req, res) => {},
  deleteKey: async (req, res) => {},
  getAllUsers: async (req, res) => {
    return res.status(200).json({ test: "successfull auth" });
  },
};
