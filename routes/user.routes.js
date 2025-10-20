const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");

router.get(
  "/getUsers",
  AuthMiddleware.authenticateUser,
  userController.getAllUsers
);

module.exports = router;
