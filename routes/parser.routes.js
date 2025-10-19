const express = require("express");
const router = express.Router();
const parserController = require("../controller/parser.controller");

router.get("/", parserController.parser);
router.get("/gs1", parserController.GS1_parser);
router.get("/hibc", parserController.HIBC_parser);
router.get("/ean_13", parserController.EAN_13_parser);

module.exports = router;
