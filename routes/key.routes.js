const express = require("express");
const KeyRouter = express.Router();
const AuthMiddleware = require("../middleware/authentication.middleware");
const CacheMiddleware = require("../middleware/cache.middleware");
const KeyController = require("../controller/key.controller");

KeyRouter.post(
  `/user/key/createKey`,
  AuthMiddleware.authenticateUser,
  KeyController.createKey
);

module.exports = KeyRouter;
