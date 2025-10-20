const express = require("express");
const router = express.Router();
const parserController = require("../controller/parser.controller");

router.post("/", parserController.parser);
router.post("/gs1", parserController.GS1_parser);
router.post("/hibc", parserController.HIBC_parser);
router.post("/ean_13", parserController.EAN_13_parser);

module.exports = router;
