const express = require("express");
const app = express();

app.listen("3000", (err) => {
  if (err) {
    console.log("unable to connect to server", err.message);
  }
  console.log("server up and running");
});
