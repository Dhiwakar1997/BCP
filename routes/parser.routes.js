const express = require("express");
const router = express.Router();
const parserController = require("../controller/parser.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");
const KeyValidator = require("../middleware/keyValidator.middlewar");
const RateLimiter = require("../middleware/rateLimiter.middleware");

router.post("/", parserController.parser);
router.post(
  "/gs1",
  AuthMiddleware.authenticateUser,
  KeyValidator,
  RateLimiter(),
  parserController.GS1_parser
);
router.post(
  "/hibc",
  AuthMiddleware.authenticateUser,
  KeyValidator,
  RateLimiter(),
  parserController.HIBC_parser
);
router.post(
  "/ean_13",
  AuthMiddleware.authenticateUser,
  KeyValidator,
  RateLimiter(),
  parserController.EAN_13_parser
);

module.exports = router;
