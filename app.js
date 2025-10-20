const express = require("express");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const router = express.Router();

const userRoutes = require("./routes/user.routes");
const parserRoutes = require("./routes/parser.routes");

router.use("/user", userRoutes);
router.use("/parser", parserRoutes);

app.use("/v1", router);

module.exports = app;
