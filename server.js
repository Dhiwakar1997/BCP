require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 3000;
const Database = require("./config/database.config");

(async () => {
  try {
    await new Database().Connect();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}/v1/`);
    });
  } catch (err) {
    console.error("Failed to start:", err.message || err);
    process.exit(1);
  }
})();
