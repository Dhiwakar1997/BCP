const mongoose = require("mongoose");
require("dotenv").config({ path: require("find-config")(".env") });

class Database {
  async Connect() {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("databse connected");
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = Database;
