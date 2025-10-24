const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const keys = require("../config/key.config");

module.exports = {
  createAuthenticatedUser: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      const user = req.user;

      let existingUser = await User.findOne({ UserEmail: user.UserEmail });

      if (existingUser) {
        const token = jwt.sign(
          {
            id: existingUser._id,
            name: existingUser.Username,
            email: existingUser.UserEmail,
            accountType: existingUser.AccountType,
          },
          keys.JwtSecret,
          { expiresIn: "7d" }
        );

        return res.status(200).json({
          message: "User already exists. Logged in successfully.",
          token,
          user: existingUser,
        });
      }

      const newUser = new User({
        Username: user.Username,
        UserEmail: user.UserEmail,
        AuthProvider: "google",
      });

      await newUser.save();

      const token = jwt.sign(
        {
          id: newUser._id,
          name: newUser.Username,
          email: newUser.UserEmail,
          accountType: newUser.AccountType,
        },
        keys.JwtSecret,
        { expiresIn: "7d" }
      );

      const apiContext = {
        apiLimit: 1000,
        used: 0,
      };

      return res.status(200).json({
        message: "Google authentication successful, new user created.",
        token,
        user: newUser,
        context: apiContext,
      });
    } catch (err) {
      console.error("Error in createAuthenticatedUser:", err);
      return res.status(500).json({ message: "Server error" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const user = await User.find();
      if (!user) {
        return res.status(200).json({ Message: "No user found" });
      }
      return res.status(200).json({ user });
    } catch (err) {
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
};
