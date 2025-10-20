const UserController = require("../controller/user.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");
const passport = require("passport");
const express = require("express");
const AuthRouter = express.Router();

AuthRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Step 2: Handle Google callback → calls createUser
AuthRouter.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  UserController.createUser
);

module.exports = AuthRouter;
