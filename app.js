const express = require("express");

const app = express();
const router = express.Router();

const userRoutes = require("./routes/user.routes");
const parserRoutes = require("./routes/parser.routes");

router.use("/user", userRoutes);
router.use("/parser", parserRoutes);

app.use(express.json());
app.use("/v1", router);

module.exports = app;