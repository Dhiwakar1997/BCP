const UserController = require("../controller/user.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");
const passport = require("passport");
const express = require("express");
const AuthRouter = express.Router();

AuthRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

AuthRouter.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { session: false }),
  UserController.createAuthenticatedUser
);

module.exports = AuthRouter;
