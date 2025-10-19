const express = require("express");
const router = express.Router();

const userRoutes = require("./user.routes");
const parserRoutes = require("./parser.routes");

router.use("/user", userRoutes);
router.use("/parser", parserRoutes);

module.exports = router;
