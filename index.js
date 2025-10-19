const express = require("express");
const app = express();
const Database = require("./config/database.config");

(async () => {
  try {
    await new Database().Connect();
    app.listen(3000, () => {
      console.log("server up and running on port 3000");
    });
  } catch (err) {
    console.error("Failed to start:", err.message || err);
    process.exit(1);
  }
})();
