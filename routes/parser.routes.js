const express = require("express");
const router = express.Router();
const ParserController = require("../controller/parser.controller");
const AuthMiddleware = require("../middleware/authentication.middleware");
const KeyValidator = require("../middleware/keyValidator.middlewar");
const RateLimiter = require("../middleware/rateLimiter.middleware");

router.post("/", ParserController.parser);
router.post(
  "/gs1",
  // AuthMiddleware.authenticateUser,
  // KeyValidator,
  // RateLimiter(),
  ParserController.GS1_parser
);
router.post(
  "/hibc",
  // AuthMiddleware.authenticateUser,
  // KeyValidator,
  // RateLimiter(),
  ParserController.HIBC_parser
);
router.post(
  "/ean_13",
  // AuthMiddleware.authenticateUser,
  // KeyValidator,
  // RateLimiter(),
  ParserController.EAN_13_parser
);

module.exports = router;
