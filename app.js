const express = require("express");
const app = express();
const passport = require("passport");
const GoogleStrategy = require("./strategies/auth.strategies");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(passport.initialize());

const userRoutes = require("./routes/user.routes");
const parserRoutes = require("./routes/parser.routes");
const AuthRoutes = require("./routes/auth.routes");
const UserRoutes = require("./routes/user.routes");

app.use(AuthRoutes);
app.use(UserRoutes);

app.use("/v1/user", userRoutes);
app.use("/v1/parser", parserRoutes);

module.exports = app;
