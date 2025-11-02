const express = require("express");
const UserRouter = express.Router();
const userController = require("../controller/user.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");
const RateLimiter = require("../middleware/rateLimiter.middleware");
const KeyValidator = require("../middleware/keyValidator.middlewar");

UserRouter.get(
  "/allUsers",
  AuthMiddleware.authenticateUser,
  KeyValidator,
  RateLimiter(),
  userController.getAllUsers
);

module.exports = UserRouter;
