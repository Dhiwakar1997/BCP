const express = require("express");
const UserRouter = express.Router();
const userController = require("../controller/user.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");
const RateLimiter = require("../middleware/rateLimiter.middleware");

UserRouter.get(
  "/allUsers",
  AuthMiddleware.authenticateUser,
  RateLimiter(),
  userController.getAllUsers
);

module.exports = UserRouter;
