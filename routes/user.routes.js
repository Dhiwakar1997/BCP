const express = require("express");
const UserRouter = express.Router();
const userController = require("../controller/user.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");

UserRouter.get(
  "/getUsers",
  AuthMiddleware.authenticateUser,
  userController.getAllUsers
);

UserRouter.get(
  "/allUsers",
  AuthMiddleware.authenticateUser,
  userController.getAllUsers
);

module.exports = UserRouter;
